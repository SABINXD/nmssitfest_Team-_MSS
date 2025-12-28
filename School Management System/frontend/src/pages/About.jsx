import "./About.css";

 function About() {
  return (
    <div className="about-page">
      <div className="about-container">
        <div className="about-header">
          <h1>About Narayani Model Secondary School</h1>
          <p className="about-subtitle">Excellence in Education Since Our Inception</p>
        </div>

        <div className="about-content">
          <div className="about-image-section">
            <div className="about-photos">
              <div className="image-placeholder image-placeholder--main">
                <p>📸</p>
                <p className="image-note">Main photo (school building / campus)</p>
              </div>

              <div className="image-grid">
                <div className="image-placeholder image-placeholder--small">
                  <p>🏫</p>
                  <p className="image-note">Classrooms</p>
                </div>
                <div className="image-placeholder image-placeholder--small">
                  <p>📚</p>
                  <p className="image-note">Library</p>
                </div>
                <div className="image-placeholder image-placeholder--small">
                  <p>🏀</p>
                  <p className="image-note">Sports & Activities</p>
                </div>
              </div>
            </div>
          </div>

          <div className="about-text-section">
            <section className="about-section">
              <h2>Our School</h2>
              <p>
                Narayani Model Secondary School is a premier educational institution dedicated to providing 
                comprehensive, quality education to students from Nursery to Grade 12. Located in Nepal, our 
                school has established itself as a beacon of academic excellence and holistic development.
              </p>
            </section>

            <section className="about-section">
              <h2>Our Mission</h2>
              <p>
                Our mission is to nurture young minds and develop responsible citizens who are prepared for 
                higher education and equipped with the skills, knowledge, and values needed to succeed in 
                an ever-changing world. We strive to create an inclusive learning environment where every 
                student can achieve their full potential.
              </p>
            </section>

            <section className="about-section">
              <h2>Academic Programs</h2>
              <p>
                Narayani Model Secondary School offers a comprehensive curriculum including:
              </p>
              <ul>
                <li><strong>Early Childhood Education:</strong> Nursery and Kindergarten programs that lay a strong foundation for future learning</li>
                <li><strong>Primary Education:</strong> Grades 1-5 with a focus on building fundamental skills</li>
                <li><strong>Secondary Education:</strong> Grades 6-10 following the national curriculum</li>
                <li><strong>Higher Secondary:</strong> Grade 11-12 with Science and Management streams</li>
                <li><strong>Special Programs:</strong> Diploma in Information Technology (IT)</li>
              </ul>
            </section>

            <section className="about-section">
              <h2>Inclusive Education</h2>
              <p>
                We are committed to inclusive education and provide specialized support for students with 
                diverse needs. Our school includes dedicated facilities for blind students and students with 
                mental challenges, including hostel accommodations to ensure they receive comprehensive care 
                and education.
              </p>
            </section>

            <section className="about-section">
              <h2>State-of-the-Art Facilities</h2>
              <p>
                Our campus is equipped with modern facilities designed to enhance the learning experience:
              </p>
              <ul>
                <li>Well-equipped science laboratories for hands-on learning</li>
                <li>Modern computer labs with latest technology</li>
                <li>Extensive library with a vast collection of books and digital resources</li>
                <li>Sports facilities and playgrounds for physical development</li>
                <li>Hostel facilities for students who need accommodation</li>
              </ul>
            </section>

            <section className="about-section">
              <h2>Experienced Faculty</h2>
              <p>
                Our team of qualified and dedicated teachers is committed to student success. With years of 
                experience and continuous professional development, our educators employ innovative teaching 
                methods to ensure effective learning outcomes.
              </p>
            </section>

            <section className="about-section">
              <h2>Holistic Development</h2>
              <p>
                Beyond academics, we emphasize holistic development through various extracurricular activities 
                including sports, arts, music, debate, and various clubs. These activities help students 
                develop leadership skills, creativity, and teamwork while pursuing their interests and passions.
              </p>
            </section>

            <section className="about-section">
              <h2>Our Values</h2>
              <p>
                At Narayani Model Secondary School, we value:
              </p>
              <ul>
                <li><strong>Excellence:</strong> Striving for the highest standards in all we do</li>
                <li><strong>Integrity:</strong> Building character through honesty and ethical behavior</li>
                <li><strong>Inclusivity:</strong> Welcoming and supporting all students regardless of their background or abilities</li>
                <li><strong>Innovation:</strong> Embracing new methods and technologies in education</li>
                <li><strong>Community:</strong> Fostering a sense of belonging and responsibility towards our community</li>
              </ul>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;

