// ==================== MULTI-LANGUAGE SUPPORT (12 LANGUAGES) ====================

let currentLanguage = 'en';

const translations = {
    en: {
        // Navigation
        home: "🏠 Home", play: "🎯 Play", leaderboard: "🏆 Leaderboard",
        profile: "👤 Profile", login: "🔐 Login", logout: "🚪 Logout",
        
        // Home Page
        welcome_title: "Welcome to Gamified Learning",
        welcome_text: "Learn through games, earn points, collect badges, and compete with friends!",
        start_learning: "🚀 Start Learning →", hero_badge: "🎓 Higher Education",
        
        // Features
        feature_games_title: "Interactive Games", feature_games_text: "Debugging, Coding Challenges",
        feature_badges_title: "Earn Badges", feature_badges_text: "Speed Demon, Perfect Player",
        feature_progress_title: "Track Progress", feature_progress_text: "Monitor your journey",
        feature_languages_title: "12 Languages", feature_languages_text: "Learn in your language",
        
        // Play Page
        select_degree: "🎓 Select Your Degree", select_degree_text: "Choose your academic path",
        back_to_degrees: "← Back to Degrees", select_branch: "🔧 Select Your Branch",
        back_to_branches: "← Back to Branches", select_semester: "📚 Select Semester",
        back_to_semesters: "← Back to Semesters", select_subject: "📖 Select Subject",
        back_to_subjects: "← Back to Subjects", select_topic: "🎮 Select Topic to Play",
        
        // Leaderboard
        leaderboard_title: "🏆 Global Leaderboard", leaderboard_text: "Top players from around the world",
        overall_points: "🏅 Overall Points", top_streaks: "🔥 Top Streaks",
        
        // Profile
        total_points: "Total Points", level: "Level", streak: "Day Streak",
        completed: "Completed Topics", your_progress: "📈 Your Progress",
        percent_complete: "% Complete", earned_badges: "🏅 Earned Badges",
        recent_activity: "📜 Recent Activity", level_prefix: "Level ",
        
        // Auth Modal
        welcome_back: "🔐 Welcome Back!", login_text: "Login to continue your learning journey",
        continue_google: "🍔 Continue with Google", continue_facebook: "📘 Continue with Facebook",
        or: "OR", login_btn: "🎮 Login", no_account: "Don't have an account?",
        create_account: "Create Account →", create_account_title: "✨ Create Account",
        signup_text: "Start your gamified learning adventure!",
        signup_google: "🍔 Sign up with Google", signup_facebook: "📘 Sign up with Facebook",
        signup_btn: "🚀 Sign Up", has_account: "Already have an account?", login_link: "Login →"
    },
    hi: {
        home: "🏠 होम", play: "🎯 खेलें", leaderboard: "🏆 लीडरबोर्ड",
        profile: "👤 प्रोफाइल", login: "🔐 लॉगिन", logout: "🚪 लॉगआउट",
        welcome_title: "गेमिफाइड लर्निंग में आपका स्वागत है",
        welcome_text: "गेम खेलकर सीखें, पॉइंट्स कमाएं और दोस्तों से प्रतिस्पर्धा करें!",
        start_learning: "🚀 सीखना शुरू करें →", hero_badge: "🎓 उच्च शिक्षा",
        feature_games_title: "इंटरैक्टिव गेम्स", feature_games_text: "डिबगिंग, कोडिंग चुनौतियाँ",
        feature_badges_title: "बैज अर्जित करें", feature_badges_text: "स्पीड डेमन, परफेक्ट प्लेयर",
        feature_progress_title: "प्रगति ट्रैक करें", feature_progress_text: "अपनी यात्रा को ट्रैक करें",
        feature_languages_title: "12 भाषाएं", feature_languages_text: "अपनी भाषा में सीखें",
        select_degree: "🎓 अपनी डिग्री चुनें", select_degree_text: "अपना शैक्षणिक पथ चुनें",
        back_to_degrees: "← डिग्री पर वापस", select_branch: "🔧 अपनी शाखा चुनें",
        back_to_branches: "← शाखाओं पर वापस", select_semester: "📚 सेमेस्टर चुनें",
        back_to_semesters: "← सेमेस्टर पर वापस", select_subject: "📖 विषय चुनें",
        back_to_subjects: "← विषयों पर वापस", select_topic: "🎮 खेलने के लिए टॉपिक चुनें",
        leaderboard_title: "🏆 वैश्विक लीडरबोर्ड", leaderboard_text: "दुनिया भर के शीर्ष खिलाड़ी",
        overall_points: "🏅 कुल अंक", top_streaks: "🔥 शीर्ष स्ट्रीक",
        total_points: "कुल अंक", level: "स्तर", streak: "दिन स्ट्रीक",
        completed: "पूर्ण किए गए टॉपिक", your_progress: "📈 आपकी प्रगति",
        percent_complete: "% पूर्ण", earned_badges: "🏅 प्राप्त बैज",
        recent_activity: "📜 हाल की गतिविधि", level_prefix: "स्तर ",
        welcome_back: "🔐 वापसी पर स्वागत है!", login_text: "अपनी शिक्षा यात्रा जारी रखने के लिए लॉगिन करें",
        continue_google: "🍔 Google से जारी रखें", continue_facebook: "📘 Facebook से जारी रखें",
        or: "या", login_btn: "🎮 लॉगिन", no_account: "खाता नहीं है?",
        create_account: "खाता बनाएं →", create_account_title: "✨ खाता बनाएं",
        signup_text: "अपनी गेमिफाइड लर्निंग यात्रा शुरू करें!",
        signup_google: "🍔 Google से साइन अप करें", signup_facebook: "📘 Facebook से साइन अप करें",
        signup_btn: "🚀 साइन अप", has_account: "पहले से खाता है?", login_link: "लॉगिन →"
    },
    mr: {
        home: "🏠 मुख्यपृष्ठ", play: "🎯 खेळा", leaderboard: "🏆 अग्रणी फलक",
        profile: "👤 प्रोफाइल", login: "🔐 लॉगिन", logout: "🚪 लॉगआउट",
        welcome_title: "गेमिफाइड लर्निंग मध्ये आपले स्वागत आहे",
        start_learning: "🚀 शिकणे सुरू करा →", hero_badge: "🎓 उच्च शिक्षण",
        select_degree: "🎓 आपली पदवी निवडा", select_semester: "📚 सेमिस्टर निवडा",
        select_subject: "📖 विषय निवडा", select_topic: "🎮 खेळण्यासाठी टॉपिक निवडा",
        leaderboard_title: "🏆 जागतिक अग्रणी फलक", total_points: "एकूण गुण",
        level: "स्तर", streak: "दिवसांची स्ट्रीक", login_btn: "🎮 लॉगिन",
        signup_btn: "🚀 साइन अप", logout: "🚪 लॉगआउट"
    },
    ta: {
        home: "🏠 முகப்பு", play: "🎯 விளையாடு", leaderboard: "🏆 முன்னணி பட்டியல்",
        profile: "👤 சுயவிவரம்", login: "🔐 உள்நுழைய", logout: "🚪 வெளியேறு",
        welcome_title: "கேமிஃபைட் கற்றல் தளத்திற்கு வரவேற்கிறோம்",
        start_learning: "🚀 கற்கத் தொடங்குங்கள் →", hero_badge: "🎓 உயர் கல்வி",
        select_degree: "🎓 உங்கள் பட்டத்தை தேர்ந்தெடுக்கவும்", select_semester: "📚 செமஸ்டர் தேர்ந்தெடுக்கவும்",
        select_subject: "📖 பாடத்தை தேர்ந்தெடுக்கவும்", select_topic: "🎮 விளையாட தலைப்பை தேர்ந்தெடுக்கவும்",
        leaderboard_title: "🏆 உலகளாவிய முன்னணி பட்டியல்", total_points: "மொத்த புள்ளிகள்",
        level: "நிலை", streak: "நாள் தொடர்ச்சி", login_btn: "🎮 உள்நுழைய",
        signup_btn: "🚀 பதிவு செய்க", logout: "🚪 வெளியேறு"
    },
    te: {
        home: "🏠 హోమ్", play: "🎯 ఆడండి", leaderboard: "🏆 లీడర్బోర్డ్",
        profile: "👤 ప్రొఫైల్", login: "🔐 లాగిన్ చేయండి", logout: "🚪 లాగౌట్",
        welcome_title: "గేమిఫైడ్ లెర్నింగ్ ప్లాట్ఫారమ్కు స్వాగతం",
        start_learning: "🚀 నేర్చుకోవడం ప్రారంభించండి →", hero_badge: "🎓 ఉన్నత విద్య",
        select_degree: "🎓 మీ డిగ్రీని ఎంచుకోండి", select_semester: "📚 సెమిస్టర్ ఎంచుకోండి",
        select_subject: "📖 సబ్జెక్ట్ ఎంచుకోండి", select_topic: "🎮 టాపిక్ ఎంచుకోండి",
        leaderboard_title: "🏆 గ్లోబల్ లీడర్బోర్డ్", total_points: "మొత్తం పాయింట్లు",
        level: "స్థాయి", streak: "రోజుల క్రమం", login_btn: "🎮 లాగిన్",
        signup_btn: "🚀 సైన్ అప్", logout: "🚪 లాగౌట్"
    },
    kn: {
        home: "🏠 ಮುಖಪುಟ", play: "🎯 ಆಡಿ", leaderboard: "🏆 ಲೀಡರ್ಬೋರ್ಡ್",
        profile: "👤 ಪ್ರೊಫೈಲ್", login: "🔐 ಲಾಗಿನ್ ಮಾಡಿ", logout: "🚪 ಲಾಗೌಟ್",
        welcome_title: "ಗೇಮಿಫೈಡ್ ಲರ್ನಿಂಗ್ ಪ್ಲಾಟ್ಫಾರ್ಮ್ಗೆ ಸುಸ್ವಾಗತ",
        start_learning: "🚀 ಕಲಿಯಲು ಪ್ರಾರಂಭಿಸಿ →", hero_badge: "🎓 ಉನ್ನತ ಶಿಕ್ಷಣ",
        select_degree: "🎓 ನಿಮ್ಮ ಪದವಿಯನ್ನು ಆಯ್ಕೆಮಾಡಿ", select_semester: "📚 ಸೆಮಿಸ್ಟರ್ ಆಯ್ಕೆಮಾಡಿ",
        select_subject: "📖 ವಿಷಯ ಆಯ್ಕೆಮಾಡಿ", select_topic: "🎮 ಟಾಪಿಕ್ ಆಯ್ಕೆಮಾಡಿ",
        leaderboard_title: "🏆 ಜಾಗತಿಕ ಲೀಡರ್ಬೋರ್ಡ್", total_points: "ಒಟ್ಟು ಅಂಕಗಳು",
        level: "ಮಟ್ಟ", streak: "ದಿನಗಳ ಸರಣಿ", login_btn: "🎮 ಲಾಗಿನ್",
        signup_btn: "🚀 ಸೈನ್ ಅಪ್", logout: "🚪 ಲಾಗೌಟ್"
    },
    ml: {
        home: "🏠 ഹോം", play: "🎯 കളിക്കുക", leaderboard: "🏆 ലീഡർബോർഡ്",
        profile: "👤 പ്രൊഫൈൽ", login: "🔐 ലോഗിൻ ചെയ്യുക", logout: "🚪 ലോഗൗട്ട്",
        welcome_title: "ഗെയിമിഫൈഡ് ലേണിംഗ് പ്ലാറ്റ്ഫോമിലേക്ക് സ്വാഗതം",
        start_learning: "🚀 പഠനം ആരംഭിക്കുക →", hero_badge: "🎓 ഉന്നത വിദ്യാഭ്യാസം",
        select_degree: "🎓 നിങ്ങളുടെ ബിരുദം തിരഞ്ഞെടുക്കുക", select_semester: "📚 സെമസ്റ്റർ തിരഞ്ഞെടുക്കുക",
        select_subject: "📖 വിഷയം തിരഞ്ഞെടുക്കുക", select_topic: "🎮 ടോപ്പിക്ക് തിരഞ്ഞെടുക്കുക",
        leaderboard_title: "🏆 ആഗോള ലീഡർബോർഡ്", total_points: "ആകെ പോയിൻ്റുകൾ",
        level: "ലെവൽ", streak: "ദിവസങ്ങളുടെ തുടർച്ച", login_btn: "🎮 ലോഗിൻ",
        signup_btn: "🚀 സൈൻ അപ്പ്", logout: "🚪 ലോഗൗട്ട്"
    },
    bn: {
        home: "🏠 হোম", play: "🎯 খেলুন", leaderboard: "🏆 লিডারবোর্ড",
        profile: "👤 প্রোফাইল", login: "🔐 লগইন করুন", logout: "🚪 লগআউট",
        welcome_title: "গেমিফাইড লার্নিং প্ল্যাটফর্মে স্বাগতম",
        start_learning: "🚀 শেখা শুরু করুন →", hero_badge: "🎓 উচ্চ শিক্ষা",
        select_degree: "🎓 আপনার ডিগ্রি নির্বাচন করুন", select_semester: "📚 সেমিস্টার নির্বাচন করুন",
        select_subject: "📖 বিষয় নির্বাচন করুন", select_topic: "🎮 টপিক নির্বাচন করুন",
        leaderboard_title: "🏆 গ্লোবাল লিডারবোর্ড", total_points: "মোট পয়েন্ট",
        level: "স্তর", streak: "দিনের ধারাবাহিকতা", login_btn: "🎮 লগইন",
        signup_btn: "🚀 সাইন আপ", logout: "🚪 লগআউট"
    },
    gu: {
        home: "🏠 હોમ", play: "🎯 રમો", leaderboard: "🏆 લીડરબોર્ડ",
        profile: "👤 પ્રોફાઇલ", login: "🔐 લોગિન કરો", logout: "🚪 લોગઆઉટ",
        welcome_title: "ગેમિફાઇડ લર્નિંગ પ્લેટફોર્મમાં આપનું સ્વાગત છે",
        start_learning: "🚀 શીખવાનું શરૂ કરો →", hero_badge: "🎓 ઉચ્ચ શિક્ષણ",
        select_degree: "🎓 તમારી ડિગ્રી પસંદ કરો", select_semester: "📚 સેમેસ્ટર પસંદ કરો",
        select_subject: "📖 વિષય પસંદ કરો", select_topic: "🎮 ટોપિક પસંદ કરો",
        leaderboard_title: "🏆 વૈશ્વિક લીડરબોર્ડ", total_points: "કુલ પોઇન્ટ્સ",
        level: "સ્તર", streak: "દિવસોનો સતત ક્રમ", login_btn: "🎮 લોગિન",
        signup_btn: "🚀 સાઇન અપ", logout: "🚪 લોગઆઉટ"
    },
    or: {
        home: "🏠 ହୋମ୍", play: "🎯 ଖେଳନ୍ତୁ", leaderboard: "🏆 ଲିଡରବୋର୍ଡ",
        profile: "👤 ପ୍ରୋଫାଇଲ୍", login: "🔐 ଲଗିନ୍ କରନ୍ତୁ", logout: "🚪 ଲଗଆଉଟ୍",
        welcome_title: "ଗେମିଫାଇଡ୍ ଲର୍ନିଂ ପ୍ଲାଟଫର୍ମରେ ଆପଣଙ୍କୁ ସ୍ୱାଗତ",
        start_learning: "🚀 ଶିଖିବା ଆରମ୍ଭ କରନ୍ତୁ →", hero_badge: "🎓 ଉଚ୍ଚ ଶିକ୍ଷା",
        select_degree: "🎓 ଆପଣଙ୍କ ଡିଗ୍ରୀ ଚୟନ କରନ୍ତୁ", select_semester: "📚 ସେମିଷ୍ଟର ଚୟନ କରନ୍ତୁ",
        select_subject: "📖 ବିଷୟ ଚୟନ କରନ୍ତୁ", select_topic: "🎮 ଟପିକ୍ ଚୟନ କରନ୍ତୁ",
        leaderboard_title: "🏆 ଗ୍ଲୋବାଲ୍ ଲିଡରବୋର୍ଡ", total_points: "ମୋଟ ପଏଣ୍ଟ",
        level: "ସ୍ତର", streak: "ଦିନର କ୍ରମ", login_btn: "🎮 ଲଗିନ୍",
        signup_btn: "🚀 ସାଇନ୍ ଅପ୍", logout: "🚪 ଲଗଆଉଟ୍"
    },
    pa: {
        home: "🏠 ਹੋਮ", play: "🎯 ਖੇਡੋ", leaderboard: "🏆 ਲੀਡਰਬੋਰਡ",
        profile: "👤 ਪ੍ਰੋਫਾਈਲ", login: "🔐 ਲਾਗਿਨ ਕਰੋ", logout: "🚪 ਲਾਗਆਉਟ",
        welcome_title: "ਗੇਮੀਫਾਈਡ ਲਰਨਿੰਗ ਪਲੇਟਫਾਰਮ ਵਿੱਚ ਤੁਹਾਡਾ ਸੁਆਗਤ ਹੈ",
        start_learning: "🚀 ਸਿੱਖਣਾ ਸ਼ੁਰੂ ਕਰੋ →", hero_badge: "🎓 ਉੱਚ ਸਿੱਖਿਆ",
        select_degree: "🎓 ਆਪਣੀ ਡਿਗਰੀ ਚੁਣੋ", select_semester: "📚 ਸਮੈਸਟਰ ਚੁਣੋ",
        select_subject: "📖 ਵਿਸ਼ਾ ਚੁਣੋ", select_topic: "🎮 ਟੌਪਿਕ ਚੁਣੋ",
        leaderboard_title: "🏆 ਗਲੋਬਲ ਲੀਡਰਬੋਰਡ", total_points: "ਕੁੱਲ ਪੁਆਇੰਟ",
        level: "ਪੱਧਰ", streak: "ਦਿਨਾਂ ਦੀ ਲੜੀ", login_btn: "🎮 ਲਾਗਿਨ",
        signup_btn: "🚀 ਸਾਈਨ ਅਪ", logout: "🚪 ਲਾਗਆਉਟ"
    },
    ur: {
        home: "🏠 ہوم", play: "🎯 کھیلیں", leaderboard: "🏆 لیڈر بورڈ",
        profile: "👤 پروفائل", login: "🔐 لاگ ان کریں", logout: "🚪 لاگ آؤٹ",
        welcome_title: "گییمیفائیڈ لرننگ پلیٹ فارم میں خوش آمدید",
        start_learning: "🚀 سیکھنا شروع کریں →", hero_badge: "🎓 اعلی تعلیم",
        select_degree: "🎓 اپنی ڈگری منتخب کریں", select_semester: "📚 سیمسٹر منتخب کریں",
        select_subject: "📖 مضمون منتخب کریں", select_topic: "🎮 موضوع منتخب کریں",
        leaderboard_title: "🏆 عالمی لیڈر بورڈ", total_points: "کل پوائنٹس",
        level: "درجہ", streak: "دنوں کا تسلسل", login_btn: "🎮 لاگ ان",
        signup_btn: "🚀 سائن اپ", logout: "🚪 لاگ آؤٹ"
    }
};

// Change language function
function changeLanguage(lang) {
    currentLanguage = lang;
    localStorage.setItem('preferred_language', lang);
    
    // Update all elements with data-i18n attribute
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (translations[lang] && translations[lang][key]) {
            element.textContent = translations[lang][key];
        }
    });
    
    // Update select dropdown
    const langSelect = document.getElementById('languageSelect');
    if (langSelect) langSelect.value = lang;
    
    console.log('Language changed to:', lang);
}

// Get translation helper
function t(key) {
    return translations[currentLanguage] && translations[currentLanguage][key] 
        ? translations[currentLanguage][key] 
        : translations.en[key] || key;
}

// Load saved language on page load
document.addEventListener('DOMContentLoaded', () => {
    const savedLang = localStorage.getItem('preferred_language') || 'en';
    changeLanguage(savedLang);
});