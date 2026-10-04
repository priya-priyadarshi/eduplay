// ================= LOAD DEGREES =================

async function loadDegrees() {

    try {

        const response = await fetch('/api/degrees');
        const data = await response.json();

        console.log('API DATA:', data);

        const degrees = data.degrees || data;

        const degreeList = document.getElementById('degreeList');

        if (!degrees || degrees.length === 0) {

            degreeList.innerHTML = `
                <p style="color:white;text-align:center;">
                    No Degrees Found
                </p>
            `;

            return;
        }

        degreeList.innerHTML = degrees.map(degree => `

            <div class="degree-card"
                 onclick="selectDegree('${degree._id}')">

                <h3>🎓 ${degree.name}</h3>

                <p>${degree.duration_years} Years</p>

                <small>Click to explore →</small>

            </div>

        `).join('');

    } catch (error) {

        console.error(error);

    }
}



// ================= SELECT DEGREE =================

async function selectDegree(degreeId) {

    try {

        const response = await fetch('/api/degrees');
        const data = await response.json();

        const degrees = data.degrees || data;

        const degree = degrees.find(d => d._id === degreeId);

        if (!degree) return;

        console.log('Selected Degree:', degree);

        document.getElementById('semesterSection').style.display = 'block';

        const semesterList = document.getElementById('semesterList');

        semesterList.innerHTML = degree.semesters.map(semester => `

            <div class="semester-card"
                 onclick="selectSemester('${degreeId}', ${semester.semester_number})">

                <h3>📚 Semester ${semester.semester_number}</h3>

                <p>Year ${semester.year_number}</p>

            </div>

        `).join('');

    } catch (error) {

        console.error(error);

    }
}



// ================= SELECT SEMESTER =================

async function selectSemester(degreeId, semesterNumber) {

    try {

        const response = await fetch('/api/degrees');
        const data = await response.json();

        const degrees = data.degrees || data;

        const degree = degrees.find(d => d._id === degreeId);

        if (!degree) return;

        const semester = degree.semesters.find(
            s => s.semester_number === semesterNumber
        );

        if (!semester) return;

        console.log('Semester:', semester);

        document.getElementById('subjectSection').style.display = 'block';

        const subjectList = document.getElementById('subjectList');

        subjectList.innerHTML = semester.subjects.map(subject => `

            <div class="subject-card"
                 onclick='selectSubject(${JSON.stringify(subject.topics)})'>

                <h3>📖 ${subject.name}</h3>

                <p>${subject.subject_code}</p>

            </div>

        `).join('');

    } catch (error) {

        console.error(error);

    }
}



// ================= SELECT SUBJECT =================

function selectSubject(topics) {

    document.getElementById('topicSection').style.display = 'block';

    const topicList = document.getElementById('topicList');

    topicList.innerHTML = topics.map(topic => `

        <div class="topic-card">

            <h3>🎮 ${topic.topic_name}</h3>

            <p>⭐ XP: ${topic.xp_reward}</p>

            <p>🎲 Game: ${topic.game_type}</p>

            <p>⏱ Time: ${topic.time_limit} sec</p>

        </div>

    `).join('');
}