import pandas as pd
import os
import random
import re
import shutil
from collections import defaultdict
import traceback

# ---------------- CONSTANTS ---------------- #

DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
PERIODS = [1, 2, 3, 4, 5, 6, 7, 8]
MAX_PRACTICAL_DAYS = 3


# ---------------- HELPERS ---------------- #

def expand_periods(period_str):
    if pd.isna(period_str):
        return []
    result = []
    for part in str(period_str).split(','):
        if '-' in part:
            start, end = map(int, part.split('-'))
            result.extend(map(str, range(start, end + 1)))
        else:
            result.append(part.strip())
    return result


# ---------------- MAIN GENERATOR ---------------- #

def generate_routine(
    teachers_excel_path: str,
    classes_excel_path: str,
    output_base_dir: str
):
    try:
        print(f"DEBUG: Starting generate_routine function")
        
        # -------- Setup output folders -------- #
        if os.path.exists(output_base_dir):
            shutil.rmtree(output_base_dir)

        class_dir = os.path.join(output_base_dir, "classes")
        teacher_dir = os.path.join(output_base_dir, "teachers")

        os.makedirs(class_dir)
        os.makedirs(teacher_dir)

        # -------- Load Excel files -------- #
        teachers_df = pd.read_excel(teachers_excel_path, header=[0, 1])
        classes_df = pd.read_excel(classes_excel_path)
        
        # -------- Parse Teachers -------- #
        teacher_info = {}

        for index, row in teachers_df.iterrows():
            try:
                name = row[("Name of Teacher/Staff", "Unnamed: 1_level_1")]
                subjects = row[("SUBJECTS", "Unnamed: 2_level_1")]

                if pd.isna(name) or pd.isna(subjects):
                    continue

                tdata = {
                    "subjects": [s.strip().lower() for s in str(subjects).split(",")],
                    "availability": {},
                    "exact": {},
                    "class_periods": {},
                    "assigned": defaultdict(list),
                }

                for day in DAYS:
                    tdata["availability"][day] = expand_periods(row.get((day, "AVAILABLE")))
                    exact = row.get((day, "EXACT"))
                    tdata["exact"][day] = (
                        int(exact)
                        if not pd.isna(exact) and str(exact).isdigit()
                        else len(tdata["availability"][day])
                    )

                # FIXED: Parse '2+2' format correctly
                for col in teachers_df.columns:
                    if col[0] == "Period per week" and isinstance(col[1], str):
                        cname = col[1].replace("`", "").strip()
                        count = row.get(col)
                        if not pd.isna(count):
                            # Handle '2+2' format (theory + practical)
                            try:
                                count_str = str(count)
                                if '+' in count_str:
                                    # Format: '2+2' means 2 theory + 2 practical
                                    parts = count_str.split('+')
                                    theory = int(parts[0].strip())
                                    practical = int(parts[1].strip()) if len(parts) > 1 else 0
                                else:
                                    # Format: '6' means 6 theory + 0 practical
                                    theory = int(float(count_str))  # Handle 6.0
                                    practical = 0
                                
                                tdata["class_periods"][cname] = {
                                    "theory": theory,
                                    "practical": practical
                                }
                                print(f"DEBUG: {name} teaches {cname}: {theory} theory + {practical} practical")
                                
                            except Exception as e:
                                print(f"WARNING: Could not parse period count '{count}' for {name} - {cname}")
                                tdata["class_periods"][cname] = {"theory": 0, "practical": 0}

                teacher_info[name] = tdata

            except Exception as e:
                raise RuntimeError(f"Error parsing teacher row {index}: {e}")

        # -------- Parse Classes -------- #
        class_subjects = defaultdict(list)

        for _, row in classes_df.iterrows():
            cname = f"{row['Class']}{row['Section']}".strip()
            subjstr = row.get("Subjects(Theory+Practical)")

            if pd.isna(subjstr):
                continue

            for part in subjstr.split(","):
                # Handle both "ENGLISH(5)" and "PHYSICS(8+4)" formats
                part = part.strip()
                # Pattern 1: SUBJECT(THEORY+PRACTICAL)
                match1 = re.match(r"([A-Za-z\s]+)\((\d+)(\+\d+)?\)", part)
                # Pattern 2: SUBJECT(THEORY)
                match2 = re.match(r"([A-Za-z\s]+)\((\d+)\)", part)
                
                if match1:
                    sname = match1.group(1).strip().lower()
                    theory = int(match1.group(2))
                    practical = int(match1.group(3)[1:]) if match1.group(3) else 0
                elif match2:
                    sname = match2.group(1).strip().lower()
                    theory = int(match2.group(2))
                    practical = 0
                else:
                    print(f"WARNING: Could not parse subject: {part}")
                    continue

                class_subjects[cname].append(
                    {
                        "subject": sname,
                        "theory": theory,
                        "practical": practical,
                    }
                )

        # -------- Initialize Routines -------- #
        class_routines = {
            c: pd.DataFrame("", index=DAYS, columns=PERIODS)
            for c in class_subjects
        }

        teacher_routines = {
            t: pd.DataFrame("", index=DAYS, columns=PERIODS)
            for t in teacher_info
        }

        def is_teacher_free(t, d, p):
            return (
                teacher_routines[t].at[d, p] == ""
                and str(p) in teacher_info[t]["availability"][d]
            )

        # -------- Assign Practicals -------- #
        practical_slots_used = defaultdict(set)

        for class_name, subjects in class_subjects.items():
            practical_subjects = [s for s in subjects if s["practical"] > 0]

            if len(practical_subjects) < 2:
                continue

            used_pairs = set()
            selected_days = []
            attempts = 0

            while len(selected_days) < MAX_PRACTICAL_DAYS and attempts < 20:
                day = random.choice(DAYS)

                if day in selected_days:
                    attempts += 1
                    continue

                random.shuffle(practical_subjects)
                assigned = False

                for i in range(len(practical_subjects)):
                    for j in range(i + 1, len(practical_subjects)):
                        s1, s2 = practical_subjects[i], practical_subjects[j]
                        pair = tuple(sorted([s1["subject"], s2["subject"]]))

                        if pair in used_pairs:
                            continue

                        for p in range(1, 8):
                            if (p, p + 1) in practical_slots_used[day]:
                                continue

                            if (
                                class_routines[class_name].at[day, p] != ""
                                or class_routines[class_name].at[day, p + 1] != ""
                            ):
                                continue

                            # FIXED: Check practical availability in teacher's schedule
                            t1 = next(
                                (
                                    t
                                    for t, d in teacher_info.items()
                                    if s1["subject"] in d["subjects"]
                                    and class_name in d["class_periods"]
                                    and d["class_periods"][class_name]["practical"] >= 2  # Has enough practical periods
                                    and is_teacher_free(t, day, p)
                                    and is_teacher_free(t, day, p + 1)
                                ),
                                None,
                            )

                            t2 = next(
                                (
                                    t
                                    for t, d in teacher_info.items()
                                    if s2["subject"] in d["subjects"]
                                    and class_name in d["class_periods"]
                                    and d["class_periods"][class_name]["practical"] >= 2  # Has enough practical periods
                                    and is_teacher_free(t, day, p)
                                    and is_teacher_free(t, day, p + 1)
                                ),
                                None,
                            )

                            if t1 and t2:
                                class_routines[class_name].at[day, p] = f"{s1['subject'].title()}-PR ({t1})"
                                class_routines[class_name].at[day, p + 1] = f"{s2['subject'].title()}-PR ({t2})"

                                teacher_routines[t1].at[day, p] = teacher_routines[t1].at[day, p + 1] = f"{class_name}-{s1['subject'].title()}-PR"
                                teacher_routines[t2].at[day, p] = teacher_routines[t2].at[day, p + 1] = f"{class_name}-{s2['subject'].title()}-PR"

                                # Deduct practical periods
                                teacher_info[t1]["class_periods"][class_name]["practical"] -= 2
                                teacher_info[t2]["class_periods"][class_name]["practical"] -= 2

                                practical_slots_used[day].add((p, p + 1))
                                used_pairs.add(pair)
                                selected_days.append(day)
                                assigned = True
                                break

                        if assigned:
                            break
                    if assigned:
                        break

                attempts += 1

        # -------- Assign Theory -------- #
        for cname, subs in class_subjects.items():
            for s in subs:
                remaining = s["theory"]

                for tname, tdata in teacher_info.items():
                    if s["subject"] in tdata["subjects"] and cname in tdata["class_periods"]:
                        slots = [
                            (d, p)
                            for d in DAYS
                            for p in PERIODS
                            if class_routines[cname].at[d, p] == ""
                            and is_teacher_free(tname, d, p)
                        ]

                        random.shuffle(slots)

                        for d, p in slots:
                            # FIXED: Check theory availability
                            if remaining <= 0 or tdata["class_periods"][cname]["theory"] <= 0:
                                break

                            class_routines[cname].at[d, p] = f"{s['subject'].title()}-TH ({tname})"
                            teacher_routines[tname].at[d, p] = f"{cname}-{s['subject'].title()}-TH"

                            remaining -= 1
                            tdata["class_periods"][cname]["theory"] -= 1  # Deduct theory period

                        if remaining <= 0:
                            break

        # -------- Save Files -------- #
        for cname, df in class_routines.items():
            df.to_excel(os.path.join(class_dir, f"{cname}.xlsx"))

        for tname, df in teacher_routines.items():
            safe_name = tname.replace(" ", "_")
            df.to_excel(os.path.join(teacher_dir, f"{safe_name}.xlsx"))

        print(f"DEBUG: Successfully generated routine")
        return output_base_dir
        
    except Exception as e:
        print(f"CRITICAL ERROR in generate_routine:")
        print(traceback.format_exc())
        raise