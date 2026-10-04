const mongoose = require('mongoose');
require('dotenv').config();

// Schema
const branchSchema = new mongoose.Schema({
    name: String,
    code: String,
    semesters: [{
        semester_number: Number,
        year_number: Number,
        subjects: [{
            name: String,
            subject_code: String,
            topics: [{
                topic_name: String,
                topic_order: Number,
                xp_reward: Number,
                game_type: String,
                time_limit: Number
            }]
        }]
    }]
});

const degreeSchema = new mongoose.Schema({
    name: String,
    duration_years: Number,
    display_order: Number,
    icon: String,
    branches: [branchSchema]
});

const Degree = mongoose.models.Degree || mongoose.model('Degree', degreeSchema);

const degreesData = [

    // ==================== 1. B.TECH (8 Semesters, 5 Branches) ====================
    {
        name: "B.Tech",
        duration_years: 4,
        display_order: 1,
        icon: "🔧",
        branches: [
            {
                name: "Computer Science Engineering", code: "CSE",
                semesters: [
                    { semester_number: 1, year_number: 1, subjects: [{ name: "Programming in C", subject_code: "CSE101", topics: [] }, { name: "Engineering Mathematics-1", subject_code: "MATH101", topics: [] }, { name: "Digital Logic Design", subject_code: "DLD101", topics: [] }] },
                    { semester_number: 2, year_number: 1, subjects: [{ name: "Data Structures", subject_code: "CSE201", topics: [] }, { name: "Object Oriented Programming", subject_code: "OOP201", topics: [] }] },
                    { semester_number: 3, year_number: 2, subjects: [{ name: "DBMS", subject_code: "DBMS301", topics: [] }, { name: "Operating Systems", subject_code: "OS301", topics: [] }] },
                    { semester_number: 4, year_number: 2, subjects: [{ name: "Computer Networks", subject_code: "CN401", topics: [] }, { name: "Software Engineering", subject_code: "SE401", topics: [] }] },
                    { semester_number: 5, year_number: 3, subjects: [{ name: "Web Technologies", subject_code: "WT501", topics: [] }, { name: "Artificial Intelligence", subject_code: "AI501", topics: [] }] },
                    { semester_number: 6, year_number: 3, subjects: [{ name: "Cloud Computing", subject_code: "CC601", topics: [] }, { name: "Cyber Security", subject_code: "CS601", topics: [] }] },
                    { semester_number: 7, year_number: 4, subjects: [{ name: "Big Data Analytics", subject_code: "BDA701", topics: [] }] },
                    { semester_number: 8, year_number: 4, subjects: [{ name: "Project Management", subject_code: "PM801", topics: [] }] }
                ]
            },
            {
                name: "Mechanical Engineering", code: "ME",
                semesters: [
                    { semester_number: 1, year_number: 1, subjects: [{ name: "Engineering Drawing", subject_code: "ME101", topics: [] }, { name: "Engineering Mathematics-1", subject_code: "MATH101", topics: [] }] },
                    { semester_number: 2, year_number: 1, subjects: [{ name: "Workshop Technology", subject_code: "ME201", topics: [] }, { name: "Engineering Mechanics", subject_code: "ME202", topics: [] }] },
                    { semester_number: 3, year_number: 2, subjects: [{ name: "Thermodynamics", subject_code: "ME301", topics: [] }, { name: "Strength of Materials", subject_code: "ME302", topics: [] }] },
                    { semester_number: 4, year_number: 2, subjects: [{ name: "Fluid Mechanics", subject_code: "ME401", topics: [] }, { name: "Manufacturing Processes", subject_code: "ME402", topics: [] }] },
                    { semester_number: 5, year_number: 3, subjects: [{ name: "Heat & Mass Transfer", subject_code: "ME501", topics: [] }, { name: "Machine Design", subject_code: "ME502", topics: [] }] },
                    { semester_number: 6, year_number: 3, subjects: [{ name: "CAD/CAM", subject_code: "ME601", topics: [] }, { name: "Refrigeration & AC", subject_code: "ME602", topics: [] }] },
                    { semester_number: 7, year_number: 4, subjects: [{ name: "Automobile Engineering", subject_code: "ME701", topics: [] }] },
                    { semester_number: 8, year_number: 4, subjects: [{ name: "Industrial Management", subject_code: "ME801", topics: [] }] }
                ]
            },
            {
                name: "Civil Engineering", code: "CE",
                semesters: [
                    { semester_number: 1, year_number: 1, subjects: [{ name: "Engineering Drawing", subject_code: "CE101", topics: [] }, { name: "Engineering Mathematics-1", subject_code: "MATH101", topics: [] }] },
                    { semester_number: 2, year_number: 1, subjects: [{ name: "Building Materials", subject_code: "CE201", topics: [] }, { name: "Surveying", subject_code: "CE202", topics: [] }] },
                    { semester_number: 3, year_number: 2, subjects: [{ name: "Strength of Materials", subject_code: "CE301", topics: [] }, { name: "Fluid Mechanics", subject_code: "CE302", topics: [] }] },
                    { semester_number: 4, year_number: 2, subjects: [{ name: "Structural Analysis", subject_code: "CE401", topics: [] }, { name: "Geotechnical Engineering", subject_code: "CE402", topics: [] }] },
                    { semester_number: 5, year_number: 3, subjects: [{ name: "Transportation Engineering", subject_code: "CE501", topics: [] }, { name: "Environmental Engineering", subject_code: "CE502", topics: [] }] },
                    { semester_number: 6, year_number: 3, subjects: [{ name: "Design of Steel Structures", subject_code: "CE601", topics: [] }, { name: "Design of RCC Structures", subject_code: "CE602", topics: [] }] },
                    { semester_number: 7, year_number: 4, subjects: [{ name: "Construction Management", subject_code: "CE701", topics: [] }] },
                    { semester_number: 8, year_number: 4, subjects: [{ name: "Project Planning", subject_code: "CE801", topics: [] }] }
                ]
            },
            {
                name: "Electronics & Communication", code: "ECE",
                semesters: [
                    { semester_number: 1, year_number: 1, subjects: [{ name: "Electronic Devices", subject_code: "ECE101", topics: [] }, { name: "Engineering Mathematics-1", subject_code: "MATH101", topics: [] }] },
                    { semester_number: 2, year_number: 1, subjects: [{ name: "Network Theory", subject_code: "ECE201", topics: [] }, { name: "Digital Electronics", subject_code: "ECE202", topics: [] }] },
                    { semester_number: 3, year_number: 2, subjects: [{ name: "Analog Circuits", subject_code: "ECE301", topics: [] }, { name: "Signals & Systems", subject_code: "ECE302", topics: [] }] },
                    { semester_number: 4, year_number: 2, subjects: [{ name: "Communication Systems", subject_code: "ECE401", topics: [] }, { name: "Microprocessors", subject_code: "ECE402", topics: [] }] },
                    { semester_number: 5, year_number: 3, subjects: [{ name: "VLSI Design", subject_code: "ECE501", topics: [] }, { name: "Digital Signal Processing", subject_code: "ECE502", topics: [] }] },
                    { semester_number: 6, year_number: 3, subjects: [{ name: "Wireless Communication", subject_code: "ECE601", topics: [] }, { name: "Embedded Systems", subject_code: "ECE602", topics: [] }] },
                    { semester_number: 7, year_number: 4, subjects: [{ name: "Optical Communication", subject_code: "ECE701", topics: [] }] },
                    { semester_number: 8, year_number: 4, subjects: [{ name: "Project Work", subject_code: "ECE801", topics: [] }] }
                ]
            },
            {
                name: "Data Science & Analytics", code: "DSA",
                semesters: [
                    { semester_number: 1, year_number: 1, subjects: [{ name: "Python Programming", subject_code: "DSA101", topics: [] }, { name: "Mathematics for Data Science", subject_code: "MATH101", topics: [] }] },
                    { semester_number: 2, year_number: 1, subjects: [{ name: "Data Structures", subject_code: "DSA201", topics: [] }, { name: "Statistics", subject_code: "STAT201", topics: [] }] },
                    { semester_number: 3, year_number: 2, subjects: [{ name: "Machine Learning Basics", subject_code: "ML301", topics: [] }, { name: "Database Management", subject_code: "DSA301", topics: [] }] },
                    { semester_number: 4, year_number: 2, subjects: [{ name: "Big Data Analytics", subject_code: "DSA401", topics: [] }, { name: "Data Visualization", subject_code: "DSA402", topics: [] }] },
                    { semester_number: 5, year_number: 3, subjects: [{ name: "Deep Learning", subject_code: "DSA501", topics: [] }, { name: "NLP", subject_code: "NLP501", topics: [] }] },
                    { semester_number: 6, year_number: 3, subjects: [{ name: "Cloud Computing", subject_code: "CC601", topics: [] }, { name: "Data Mining", subject_code: "DM602", topics: [] }] },
                    { semester_number: 7, year_number: 4, subjects: [{ name: "Business Intelligence", subject_code: "BI701", topics: [] }] },
                    { semester_number: 8, year_number: 4, subjects: [{ name: "Capstone Project", subject_code: "PRJ801", topics: [] }] }
                ]
            }
        ]
    },

    // ==================== 2. MBA (4 Semesters, 4 Branches) ====================
    {
        name: "MBA",
        duration_years: 2,
        display_order: 2,
        icon: "💼",
        branches: [
            {
                name: "Marketing Management", code: "MKT",
                semesters: [
                    { semester_number: 1, year_number: 1, subjects: [{ name: "Principles of Management", subject_code: "MBA101", topics: [] }, { name: "Marketing Management", subject_code: "MKT102", topics: [] }] },
                    { semester_number: 2, year_number: 1, subjects: [{ name: "Consumer Behavior", subject_code: "MKT201", topics: [] }, { name: "Brand Management", subject_code: "MKT202", topics: [] }] },
                    { semester_number: 3, year_number: 2, subjects: [{ name: "Digital Marketing", subject_code: "MKT301", topics: [] }, { name: "Sales Management", subject_code: "MKT302", topics: [] }] },
                    { semester_number: 4, year_number: 2, subjects: [{ name: "Strategic Marketing", subject_code: "MKT401", topics: [] }] }
                ]
            },
            {
                name: "Finance Management", code: "FIN",
                semesters: [
                    { semester_number: 1, year_number: 1, subjects: [{ name: "Financial Accounting", subject_code: "FIN101", topics: [] }, { name: "Corporate Finance", subject_code: "FIN102", topics: [] }] },
                    { semester_number: 2, year_number: 1, subjects: [{ name: "Investment Analysis", subject_code: "FIN201", topics: [] }, { name: "Risk Management", subject_code: "FIN202", topics: [] }] },
                    { semester_number: 3, year_number: 2, subjects: [{ name: "International Finance", subject_code: "FIN301", topics: [] }, { name: "Financial Modeling", subject_code: "FIN302", topics: [] }] },
                    { semester_number: 4, year_number: 2, subjects: [{ name: "Portfolio Management", subject_code: "FIN401", topics: [] }] }
                ]
            },
            {
                name: "Human Resource Management", code: "HRM",
                semesters: [
                    { semester_number: 1, year_number: 1, subjects: [{ name: "Organizational Behavior", subject_code: "HRM101", topics: [] }, { name: "HR Planning", subject_code: "HRM102", topics: [] }] },
                    { semester_number: 2, year_number: 1, subjects: [{ name: "Recruitment & Selection", subject_code: "HRM201", topics: [] }, { name: "Performance Management", subject_code: "HRM202", topics: [] }] },
                    { semester_number: 3, year_number: 2, subjects: [{ name: "Training & Development", subject_code: "HRM301", topics: [] }, { name: "Industrial Relations", subject_code: "HRM302", topics: [] }] },
                    { semester_number: 4, year_number: 2, subjects: [{ name: "Strategic HRM", subject_code: "HRM401", topics: [] }] }
                ]
            },
            {
                name: "Operations Management", code: "OPS",
                semesters: [
                    { semester_number: 1, year_number: 1, subjects: [{ name: "Operations Management", subject_code: "OPS101", topics: [] }, { name: "Supply Chain Management", subject_code: "OPS102", topics: [] }] },
                    { semester_number: 2, year_number: 1, subjects: [{ name: "Project Management", subject_code: "OPS201", topics: [] }, { name: "Quality Management", subject_code: "OPS202", topics: [] }] },
                    { semester_number: 3, year_number: 2, subjects: [{ name: "Logistics Management", subject_code: "OPS301", topics: [] }, { name: "Inventory Control", subject_code: "OPS302", topics: [] }] },
                    { semester_number: 4, year_number: 2, subjects: [{ name: "Strategic Operations", subject_code: "OPS401", topics: [] }] }
                ]
            }
        ]
    },

    // ==================== 3. BCA (6 Semesters, 2 Branches) ====================
    {
        name: "BCA",
        duration_years: 3,
        display_order: 3,
        icon: "💻",
        branches: [
            {
                name: "General BCA", code: "BCA",
                semesters: [
                    { semester_number: 1, year_number: 1, subjects: [{ name: "Computer Fundamentals", subject_code: "BCA101", topics: [] }, { name: "C Programming", subject_code: "BCA102", topics: [] }] },
                    { semester_number: 2, year_number: 1, subjects: [{ name: "Data Structures", subject_code: "BCA201", topics: [] }, { name: "Operating Systems", subject_code: "BCA202", topics: [] }] },
                    { semester_number: 3, year_number: 2, subjects: [{ name: "DBMS", subject_code: "BCA301", topics: [] }, { name: "Java Programming", subject_code: "BCA302", topics: [] }] },
                    { semester_number: 4, year_number: 2, subjects: [{ name: "Python Programming", subject_code: "BCA401", topics: [] }, { name: "Web Technology", subject_code: "BCA402", topics: [] }] },
                    { semester_number: 5, year_number: 3, subjects: [{ name: "Cloud Computing", subject_code: "BCA501", topics: [] }, { name: "Cyber Security", subject_code: "BCA502", topics: [] }] },
                    { semester_number: 6, year_number: 3, subjects: [{ name: "Major Project", subject_code: "BCA601", topics: [] }] }
                ]
            },
            {
                name: "BCA Data Science", code: "BCADS",
                semesters: [
                    { semester_number: 1, year_number: 1, subjects: [{ name: "Python Programming", subject_code: "DS101", topics: [] }, { name: "Statistics", subject_code: "STAT101", topics: [] }] },
                    { semester_number: 2, year_number: 1, subjects: [{ name: "Data Visualization", subject_code: "DS201", topics: [] }, { name: "SQL for Data Science", subject_code: "SQL201", topics: [] }] },
                    { semester_number: 3, year_number: 2, subjects: [{ name: "Machine Learning Basics", subject_code: "ML301", topics: [] }, { name: "Big Data Analytics", subject_code: "BD302", topics: [] }] },
                    { semester_number: 4, year_number: 2, subjects: [{ name: "Deep Learning", subject_code: "DL401", topics: [] }, { name: "Data Mining", subject_code: "DM402", topics: [] }] },
                    { semester_number: 5, year_number: 3, subjects: [{ name: "NLP", subject_code: "NLP501", topics: [] }] },
                    { semester_number: 6, year_number: 3, subjects: [{ name: "Data Science Project", subject_code: "PRJ601", topics: [] }] }
                ]
            }
        ]
    },

    // ==================== 4. B.Com (6 Semesters, No Branches, Direct Semesters) ====================
    {
        name: "B.Com",
        duration_years: 3,
        display_order: 4,
        icon: "📊",
        branches: [{
            name: "General B.Com", code: "BCOM",
            semesters: [
                { semester_number: 1, year_number: 1, subjects: [{ name: "Financial Accounting", subject_code: "COM101", topics: [] }, { name: "Business Economics", subject_code: "COM102", topics: [] }] },
                { semester_number: 2, year_number: 1, subjects: [{ name: "Corporate Accounting", subject_code: "COM201", topics: [] }, { name: "Cost Accounting", subject_code: "COM202", topics: [] }] },
                { semester_number: 3, year_number: 2, subjects: [{ name: "Income Tax", subject_code: "COM301", topics: [] }, { name: "Auditing", subject_code: "COM302", topics: [] }] },
                { semester_number: 4, year_number: 2, subjects: [{ name: "Financial Management", subject_code: "COM401", topics: [] }, { name: "GST", subject_code: "COM402", topics: [] }] },
                { semester_number: 5, year_number: 3, subjects: [{ name: "Investment Management", subject_code: "COM501", topics: [] }, { name: "International Business", subject_code: "COM502", topics: [] }] },
                { semester_number: 6, year_number: 3, subjects: [{ name: "Corporate Governance", subject_code: "COM601", topics: [] }, { name: "Project", subject_code: "COM602", topics: [] }] }
            ]
        }]
    },

    // ==================== 5. BBA (6 Semesters, No Branches) ====================
    {
        name: "BBA",
        duration_years: 3,
        display_order: 5,
        icon: "📈",
        branches: [{
            name: "General BBA", code: "BBA",
            semesters: [
                { semester_number: 1, year_number: 1, subjects: [{ name: "Principles of Management", subject_code: "BBA101", topics: [] }, { name: "Business Mathematics", subject_code: "BBA102", topics: [] }] },
                { semester_number: 2, year_number: 1, subjects: [{ name: "Organizational Behavior", subject_code: "BBA201", topics: [] }, { name: "Marketing Management", subject_code: "BBA202", topics: [] }] },
                { semester_number: 3, year_number: 2, subjects: [{ name: "HR Management", subject_code: "BBA301", topics: [] }, { name: "Financial Management", subject_code: "BBA302", topics: [] }] },
                { semester_number: 4, year_number: 2, subjects: [{ name: "Operations Management", subject_code: "BBA401", topics: [] }, { name: "Business Law", subject_code: "BBA402", topics: [] }] },
                { semester_number: 5, year_number: 3, subjects: [{ name: "Strategic Management", subject_code: "BBA501", topics: [] }, { name: "Entrepreneurship", subject_code: "BBA502", topics: [] }] },
                { semester_number: 6, year_number: 3, subjects: [{ name: "Project Management", subject_code: "BBA601", topics: [] }, { name: "Major Project", subject_code: "BBA602", topics: [] }] }
            ]
        }]
    },

    // ==================== 6. B.Pharmacy (8 Semesters, No Branches) ====================
    {
        name: "B.Pharmacy",
        duration_years: 4,
        display_order: 6,
        icon: "💊",
        branches: [{
            name: "General Pharmacy", code: "BPH",
            semesters: [
                { semester_number: 1, year_number: 1, subjects: [{ name: "Human Anatomy", subject_code: "BP101", topics: [] }, { name: "Pharmaceutics", subject_code: "BP102", topics: [] }] },
                { semester_number: 2, year_number: 1, subjects: [{ name: "Pharmaceutical Chemistry", subject_code: "BP201", topics: [] }, { name: "Pharmacology", subject_code: "BP202", topics: [] }] },
                { semester_number: 3, year_number: 2, subjects: [{ name: "Pharmacognosy", subject_code: "BP301", topics: [] }, { name: "Biochemistry", subject_code: "BP302", topics: [] }] },
                { semester_number: 4, year_number: 2, subjects: [{ name: "Pharmaceutical Analysis", subject_code: "BP401", topics: [] }, { name: "Medicinal Chemistry", subject_code: "BP402", topics: [] }] },
                { semester_number: 5, year_number: 3, subjects: [{ name: "Industrial Pharmacy", subject_code: "BP501", topics: [] }, { name: "Herbal Drug Technology", subject_code: "BP502", topics: [] }] },
                { semester_number: 6, year_number: 3, subjects: [{ name: "Quality Assurance", subject_code: "BP601", topics: [] }, { name: "Pharmaceutical Marketing", subject_code: "BP602", topics: [] }] },
                { semester_number: 7, year_number: 4, subjects: [{ name: "Clinical Pharmacy", subject_code: "BP701", topics: [] }, { name: "Drug Regulatory Affairs", subject_code: "BP702", topics: [] }] },
                { semester_number: 8, year_number: 4, subjects: [{ name: "Pharmacy Practice", subject_code: "BP801", topics: [] }, { name: "Project Work", subject_code: "BP802", topics: [] }] }
            ]
        }]
    },

    // ==================== 7. LLB (6 Semesters, No Branches) ====================
    {
        name: "LLB",
        duration_years: 3,
        display_order: 7,
        icon: "⚖️",
        branches: [{
            name: "General Law", code: "LAW",
            semesters: [
                { semester_number: 1, year_number: 1, subjects: [{ name: "Law of Contract", subject_code: "LAW101", topics: [] }, { name: "Constitutional Law", subject_code: "LAW102", topics: [] }] },
                { semester_number: 2, year_number: 1, subjects: [{ name: "Family Law", subject_code: "LAW201", topics: [] }, { name: "Law of Torts", subject_code: "LAW202", topics: [] }] },
                { semester_number: 3, year_number: 2, subjects: [{ name: "Property Law", subject_code: "LAW301", topics: [] }, { name: "Criminal Law", subject_code: "LAW302", topics: [] }] },
                { semester_number: 4, year_number: 2, subjects: [{ name: "Company Law", subject_code: "LAW401", topics: [] }, { name: "Environmental Law", subject_code: "LAW402", topics: [] }] },
                { semester_number: 5, year_number: 3, subjects: [{ name: "Human Rights", subject_code: "LAW501", topics: [] }, { name: "Cyber Law", subject_code: "LAW502", topics: [] }] },
                { semester_number: 6, year_number: 3, subjects: [{ name: "Civil Procedure Code", subject_code: "LAW601", topics: [] }, { name: "Criminal Procedure Code", subject_code: "LAW602", topics: [] }] }
            ]
        }]
    },

    // ==================== 8. MA Economics (4 Semesters, No Branches) ====================
    {
        name: "MA Economics",
        duration_years: 2,
        display_order: 8,
        icon: "📉",
        branches: [{
            name: "General Economics", code: "ECO",
            semesters: [
                { semester_number: 1, year_number: 1, subjects: [{ name: "Micro Economics", subject_code: "ECO101", topics: [] }, { name: "Macro Economics", subject_code: "ECO102", topics: [] }] },
                { semester_number: 2, year_number: 1, subjects: [{ name: "Econometrics", subject_code: "ECO201", topics: [] }, { name: "Indian Economy", subject_code: "ECO202", topics: [] }] },
                { semester_number: 3, year_number: 2, subjects: [{ name: "Development Economics", subject_code: "ECO301", topics: [] }, { name: "International Economics", subject_code: "ECO302", topics: [] }] },
                { semester_number: 4, year_number: 2, subjects: [{ name: "Public Economics", subject_code: "ECO401", topics: [] }, { name: "Dissertation", subject_code: "ECO402", topics: [] }] }
            ]
        }]
    },

    // ==================== 9. MCA (4 Semesters, No Branches) ====================
    {
        name: "MCA",
        duration_years: 2,
        display_order: 9,
        icon: "🖥️",
        branches: [{
            name: "General MCA", code: "MCA",
            semesters: [
                { semester_number: 1, year_number: 1, subjects: [{ name: "Advanced Programming", subject_code: "MCA101", topics: [] }, { name: "Data Structures", subject_code: "MCA102", topics: [] }] },
                { semester_number: 2, year_number: 1, subjects: [{ name: "Java Programming", subject_code: "MCA201", topics: [] }, { name: "DBMS", subject_code: "MCA202", topics: [] }] },
                { semester_number: 3, year_number: 2, subjects: [{ name: "Machine Learning", subject_code: "MCA301", topics: [] }, { name: "Cloud Computing", subject_code: "MCA302", topics: [] }] },
                { semester_number: 4, year_number: 2, subjects: [{ name: "Major Project", subject_code: "MCA401", topics: [] }, { name: "Internship", subject_code: "MCA402", topics: [] }] }
            ]
        }]
    },

    // ==================== 10. Diploma Engineering (6 Semesters, No Branches) ====================
    {
        name: "Diploma Engineering",
        duration_years: 3,
        display_order: 10,
        icon: "🔧",
        branches: [{
            name: "General Diploma", code: "DIP",
            semesters: [
                { semester_number: 1, year_number: 1, subjects: [{ name: "Applied Mathematics", subject_code: "DIP101", topics: [] }, { name: "Engineering Drawing", subject_code: "DIP102", topics: [] }] },
                { semester_number: 2, year_number: 1, subjects: [{ name: "Applied Physics", subject_code: "DIP201", topics: [] }, { name: "Workshop Technology", subject_code: "DIP202", topics: [] }] },
                { semester_number: 3, year_number: 2, subjects: [{ name: "Strength of Materials", subject_code: "DIP301", topics: [] }, { name: "Thermodynamics", subject_code: "DIP302", topics: [] }] },
                { semester_number: 4, year_number: 2, subjects: [{ name: "Fluid Mechanics", subject_code: "DIP401", topics: [] }, { name: "Manufacturing Process", subject_code: "DIP402", topics: [] }] },
                { semester_number: 5, year_number: 3, subjects: [{ name: "Electrical Machines", subject_code: "DIP501", topics: [] }, { name: "CAD/CAM", subject_code: "DIP502", topics: [] }] },
                { semester_number: 6, year_number: 3, subjects: [{ name: "Project Work", subject_code: "DIP601", topics: [] }, { name: "Industrial Training", subject_code: "DIP602", topics: [] }] }
            ]
        }]
    }
];

async function seed() {
    try {
        console.log('🔄 Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');
        
        console.log('🗑️ Clearing old degrees...');
        await Degree.deleteMany({});
        console.log('✅ Old data cleared');
        
        console.log('📥 Inserting 10 degrees with complete data...');
        await Degree.insertMany(degreesData);
        console.log('✅ Data inserted successfully!');
        
        const degrees = await Degree.find();
        console.log(`\n📊 Total Degrees: ${degrees.length}`);
        
        degrees.forEach(d => {
            console.log(`\n📚 ${d.name} (${d.duration_years} years) - ${d.branches.length} branch(es)`);
            d.branches.forEach(b => {
                let totalSubjects = 0;
                b.semesters.forEach(s => totalSubjects += s.subjects.length);
                console.log(`   ├── ${b.name} (${b.code}) - ${b.semesters.length} semesters, ${totalSubjects} subjects`);
            });
        });
        
        console.log('\n🎉 Database seeding completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

seed();