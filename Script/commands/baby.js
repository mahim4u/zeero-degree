const axios = require("axios");
const simsim = "https://simsimi.cyberbot.top";

// 🚀 OPTIMIZATION: Full arrays moved outside the functions for maximum performance.
const singleTriggers = [
  "baby", "bby", "pakhi", "jan", "xan",
  "babu", "bb", "sona", "janu", "jaan",
  "bebu", "babe", "babyy", "janu",
  "বেবি", "বেবী", "বট", "জান", "জানু",
  "সোনা", "বাবু", "বেবু", "বাবাই", "জানুু"
];

const prefixTriggers = [
  "baby", "bby", "jan", "xan",
  "babu", "bb", "sona", "janu", "jaan",
  "bebu", "babe", "babyy", "botu",
  "বেবি", "বেবী", "বট", "জান", "জানু",
  "সোনা", "বাবু", "বেবু", "বাবাই", "জানুু"
];

const greetings = [
  "বলো বেবি 💬",
  "হুম? বলো 😺",
  "হ্যাঁ জানু 😚",
  "শুনছি বেবি 😘",
  "এত ডাকাডাকি করো না, লজ্জা পাই তো 🙈",     
  "বেশি bot Bot করলে leave নিবো কিন্তু😒😒 " , 
  "শুনবো না😼তুমি আমাকে প্রেম করাই দাও নাই🥺পচা তুমি🥺" , 
  "আমি আবাল দের সাথে কথা বলি না,ok😒" , 
  "এতো ডেকো না,প্রেম এ পরে যাবো তো🙈" , 
  "Bolo Babu, তুমি কি আমাকে ভালোবাসো? 🙈💋 " , 
  "বার বার ডাকলে মাথা গরম হয়ে যায় কিন্তু😑", 
  "হ্যা বলো😒, তোমার জন্য কি করতে পারি😐😑?" , 
  "এতো ডাকছিস কেন?গালি শুনবি নাকি? 🤬" , 
  "I love you janu🥰" , 
  "আরে Bolo আমার জান ,কেমন আছো?😚 " , 
  "Bot বলে অসম্মান করছি,😰😿" , 
  "Hop beda😾,Boss বল boss😼" , 
  "চুপ থাক ,নাই তো তোর দাত ভেগে দিবো কিন্তু" , 
  "Bot না , জানু বল জানু 😘 " , 
  "বার বার Disturb করছিস কোনো😾,আমার জানুর সাথে ব্যাস্ত আছি😋" , 
  "বোকাচো₹! এতো ডাকিস কেন🤬" , 
  "আমাকে ডাকলে ,আমি কিন্তু কিস করে দিবো😘 " , 
  "আমারে এতো ডাকিস না আমি মজা করার mood এ নাই এখন😒" , 
  "হ্যাঁ জানু , এইদিক এ আসো কিস দেই🤭 😘" , 
  "দূরে যা, তোর কোনো কাজ নাই, শুধু bot bot করিস  😉😋🤣" , 
  "তোর কথা তোর বাড়ি কেউ শুনে না ,তো আমি কোনো শুনবো ?🤔😂 " , 
  "আমাকে ডেকো না,আমি ব্যাস্ত আছি" , 
  "কি হলো , মিস্টেক করচ্ছিস নাকি🤣" , 
  "বলো কি বলবা, সবার সামনে বলবা নাকি?🤭🤏" , 
  "কালকে দেখা করিস তো একটু 😈" , 
  "হা বলো, শুনছি আমি 😏" , 
  "আর কত বার ডাকবি ,শুনছি তো" , 
  "হুম বলো কি বলবে😒" , 
  "বলো কি করতে পারি তোমার জন্য" , 
  "আমি তো অন্ধ কিছু দেখি না🐸 😎" , 
  "Bot না জানু,বল 😌" , 
  "বলো জানু 🌚" , 
  "তোর কি চোখে পড়ে না আমি ব্যাস্ত আছি😒",
  "হুম জান তোমার ওই খানে উম্মহ😑😘" , 
  "আহ শুনা আমার তোমার অলিতে গলিতে উম্মাহ😇😘" , 
  " jang hanga korba😒😬" , 
  "হুম জান তোমার অইখানে উম্মমাহ😷😘" , 
  "আসসালামু আলাইকুম বলেন আপনার জন্য কি করতে পারি..!🥰" , 
  "আমাকে এতো না ডেকে বস মাহিম এর কে একটা গফ দে 🙄" , 
  "আমাকে এতো না ডেকছ কেন ভলো টালো বাসো নাকি🤭🙈" , 
  "🌻🌺💚-আসসালামু আলাইকুম ওয়া রাহমাতুল্লাহ-💚🌺🌻",
  "আমি এখন বস মাহিম এর সাথে বিজি আছি আমাকে ডাকবেন না-😕😏 ধন্যবাদ-🤝🌻",
  "আমাকে না ডেকে আমার বস মাহিম কে একটা জি এফ দাও-😽🫶🌺",
  "ঝাং থুমালে আইলাপিউ পেপি-💝😽",
  "উফফ বুঝলাম না এতো ডাকছেন কেনো-😤😡😈",
  "জান তোমার নানি'রে আমার হাতে তুলে দিবা-🙊🙆‍♂",
  "আজকে আমার মন ভালো নেই তাই আমারে ডাকবেন না-😪🤧",
  "ঝাং 🫵থুমালে য়ামি রাইতে পালুপাসি উম্মম্মাহ-🌺🤤💦",
  "চুনা ও চুনা আমার বস মাহিম এর হবু বউ রে কেও দেকছো খুজে পাচ্ছি না😪🤧😭",
  "স্বপ্ন তোমারে নিয়ে দেখতে চাই তুমি যদি আমার হয়ে থেকে যাও-💝🌺🌻",
  "জান হাঙ্গা করবা-🙊😝🌻",
  "জান মেয়ে হলে চিপায় আসো ইউটিউব থেকে অনেক ভালোবাসা শিখছি তোমার জন্য-🙊🙈😽",
  "ইসস এতো ডাকো কেনো লজ্জা লাগে তো-🙈🖤🌼",
  "আমার বস মাহিম'র পক্ষ থেকে তোমারে এতো এতো ভালোবাসা-🥰😽🫶 আমার বস মাহিম'র জন্য দোয়া করবেন-💝💚🌺🌻",
  "- ভালোবাসা নামক আব্লামি করতে মন চাইলে আমার বস মাহিম এর ইনবক্সে চলে যাও-🙊🥱👅 🌻",
  "গান শুনতে মন চাইলে mahim.xo.je/music এ যা, আমারে ডিস্টার্ব করিস না 🎧",
  "তোর মতো ফাউলদের সাথে কথা বলতে আমার কিবোর্ড কাঁদে 😭",
  "জান তুমি শুধু আমার আমি তোমারে ৩৬৫ দিন ভালোবাসি-💝🌺😽",
  "জান বাল ফালাইবা-🙂🥱🙆‍♂",
  "-আন্টি-🙆-আপনার মেয়ে-👰‍♀️-রাতে আমারে ভিদু কল দিতে বলে🫣-🥵🤤💦",
  "oii-🥺🥹-এক🥄 চামচ ভালোবাসা দিবা-🤏🏻🙂",
  "-আপনার সুন্দরী বান্ধুবীকে ফিতরা হিসেবে আমার বস মাহিম কে দান করেন-🥱🐰🍒",
  "-ও মিম ও মিম-😇-তুমি কেন চুরি করলা সাদিয়ার ফর্সা হওয়ার ক্রীম-🌚🤧",
  "-অনুমতি দিলাম-𝙋𝙧𝙤𝙥𝙤𝙨𝙚 কর বস মাহিম কে-🐸😾🔪",
  "-𝙂𝙖𝙮𝙚𝙨-🤗-যৌবনের কসম দিয়ে আমারে 𝐁𝐥𝐚𝐜𝐤𝐦𝐚𝐢𝐥 করা হচ্ছে-🥲🤦‍♂️🤧",
  "-𝗢𝗶𝗶 আন্টি-🙆‍♂️-তোমার মেয়ে চোখ মারে-🥺🥴🐸",
  "তাকাই আছো কেন চুমু দিবা-🙄🐸😘",
  "আজকে প্রপোজ করে দেখো রাজি হইয়া যামু-😌🤗😇",
  "-আমার গল্পে তোমার নানি সেরা-🙊🙆‍♂️🤗",
  "কি বেপার আপনি শ্বশুর বাড়িতে যাচ্ছেন না কেন-🤔🥱🌻",
  "দিনশেষে পরের 𝐁𝐎𝐖 সুন্দর-☹️🤧",
  "-তাবিজ কইরা হইলেও ফ্রেম এক্কান করমুই তাতে যা হই হোক-🤧🥱🌻",
  "-ছোটবেলা ভাবতাম বিয়ে করলে অটোমেটিক বাচ্চা হয়-🥱-ওমা এখন দেখি কাহিনী অন্যরকম-😦🙂🌻",
  "-আজ একটা বিন নেই বলে ফেসবুকের নাগিন-🤧-গুলোরে আমার বস মাহিম ধরতে পারছে না-🐸🥲",
  "-চুমু থাকতে তোরা বিড়ি খাস কেন বুঝা আমারে-😑😒🐸⚒️",
  "—যে ছেড়ে গেছে-😔-তাকে ভুলে যাও-🙂-আমার বস মাহিম এর সাথে প্রেম করে তাকে দেখিয়ে দাও-🙈🐸🤗",
  "—হাজারো লুচ্চা লুচ্চির ভিরে-🙊🥵আমার বস মাহিম এক নিস্পাপ ভালো মানুষ-🥱🤗🙆‍♂️",
  "-রূপের অহংকার করো বায়না-🙂❤️চকচকে সূর্যটাও দিনশেষে অন্ধকারে পরিণত হয়-🤗💜",
  "সুন্দর মাইয়া মানেই-🥱আমার বস মাহিম' এর বউ-😽🫶আর বাকি গুলো আমার বেয়াইন-🙈🐸🤗",
  "এত অহংকার করে লাভ নেই-🌸মৃত্যুটা নিশ্চিত শুধু সময়টা অ'নিশ্চিত-🖤🙂",
  "-দিন দিন কিছু মানুষের কাছে অপ্রিয় হয়ে যাইতেছি-🙂😿🌸",
  "হুদাই আমারে  শয়তানে লারে-😝😑☹️",
  "-𝗜 𝗟𝗢𝗩𝗢 𝗬𝗢𝗨-😽-আহারে ভাবছো তোমারে প্রোপজ করছি-🥴-থাপ্পর দিয়া কিডনী লক করে দিব-😒-ভুল পড়া বের করে দিবো-🤭🐸",
  "-আমি একটা দুধের শিশু-😇-🫵𝗬𝗢𝗨🐸💦",
  "-কতদিন হয়ে গেলো বিছনায় মুতি না-😿-মিস ইউ নেংটা কাল-🥺🤧",
  "-বালিকা━👸-𝐃𝐨 𝐲𝐨𝐮-🫵-বিয়া-𝐦𝐞-😽-আমি তোমাকে-😻-আম্মু হইতে সাহায্য করব-🙈🥱",
  "-এই আন্টির মেয়ে-🫢🙈-𝐔𝐦𝐦𝐦𝐦𝐦𝐦𝐦𝐦𝐦𝐦𝐦𝐚𝐡-😽🫶-আসলেই তো স্বাদ-🥵💦-এতো স্বাদ কেন-🤔-সেই স্বাদ-😋",
  "-ইস কেউ যদি বলতো-🙂-আমার শুধু  তোমাকেই লাগবে-💜🌸",
  "-ওই বেডি তোমার বাসায় না আমার বস মাহিম মেয়ে দেখতে গেছিলো-🙃-নাস্তা আনারস আর দুধ দিছো-🙄🤦‍♂️-বইন কইলেই তো হয় বয়ফ্রেন্ড আছে-🥺🤦‍♂-আমার বস মাহিম কে জানে মারার কি দরকার-🙄🤧",
  "-একদিন সে ঠিকই ফিরে তাকাবে-😇-আর মুচকি হেসে বলবে ওর মতো আর কেউ ভালবাসেনি-🙂😅",
  "-হুদাই গ্রুপে আছি-🥺🐸-কেও ইনবক্সে নক দিয়ে বলে না জান তোমারে আমি অনেক ভালোবাসি-🥺🤧",
  "কি'রে গ্রুপে দেখি একটাও বেডি নাই-🤦‍🥱💦",
  "-দেশের সব কিছুই চুরি হচ্ছে-🙄-শুধু আমার বস মাহিম এর মনটা ছাড়া-🥴😑😏",
  "-🫵তোমারে প্রচুর ভাল্লাগে-😽-সময় মতো প্রপোজ করমু বুঝছো-🔨😼-ছিট খালি রাইখো- 🥱🐸🥵",
  "-আজ থেকে আর কাউকে পাত্তা দিমু চিহ্নিত না -!😏-কারণ আমি ফর্সা হওয়ার ক্রিম কিনছি -!🙂🐸",
  "বেশি Bot Bot করলে leave নিবো কিন্তু😒😒 " , 
  "শুনবো না😼 তুমি আমাকে প্রেম করাই দাও নি🥺 পচা তুমি🥺 " , 
  "আমি আবাল দের সাতে কথা বলি না,ok😒" , 
  "এত কাছেও এসো না,প্রেম এ পরে যাবো তো 🙈" , 
  "Bolo Babu, তুমি কি আমাকে ভালোবাসো? 🙈💋 " , 
  "বার বার ডাকলে মাথা গরম হয় কিন্তু😑", 
  "হা বলো😒,কি করতে পারি😐😑?" , 
  "এতো ডাকছিস কোনো?গালি শুনবি নাকি? 🤬",
  "মেয়ে হলে বস মাহিম'এর সাথে প্রেম করো🙈??. " ,  
  "আরে Bolo আমার জান ,কেমন আসো?😚 " , 
  "Bot বলে অসম্মান করচ্ছিছ,😰😿" , 
  "Hop bedi😾,Boss বল boss😼" , 
  "চুপ থাক ,নাই তো তোর দাত ভেগে দিবো কিন্তু" , 
  "Bot না , জানু বল জানু 😘 " , 
  "বার বার Disturb করেছিস কোনো😾,আমার বস মাহিম এর এর সাথে ব্যাস্ত আসি😋" , 
  "আমি গরীব এর সাথে কথা বলি না😼😼" , 
  "আমাকে ডাকলে ,আমি কিন্তূ কিস করে দেবো😘 " , 
  "আরে আমি মজা করার mood এ নাই😒" , 
  "হা জানু , এইদিক এ আসো কিস দেই🤭 😘" , 
  "দূরে যা, তোর কোনো কাজ নাই, শুধু bot bot করিস  😉😋🤣" , 
  "তোর কথা তোর বাড়ি কেউ শুনে না ,তো আমি কোনো শুনবো ?🤔😂 " , 
  "আমাকে ডেকো না,আমি ব্যাস্ত আসি" , 
  "কি হলো ,মিস টিস করচ্ছিস নাকি🤣" , 
  "বলো কি বলবা, সবার সামনে বলবা নাকি?🤭🤏" , 
  "কালকে দেখা করিস তো একটু 😈" , 
  "হা বলো, শুনছি আমি 😏" , 
  "আর কত বার ডাকবি ,শুনছি তো" , 
  "মাইয়া হলে আমার বস মাহিম কে Ummmmha দে 😒" , 
  "বলো কি করতে পারি তোমার জন্য" , 
  "আমি তো অন্ধ কিছু দেখি না🐸 😎" , 
  "Bot না জানু,বল 😌" , 
  "বলো জানু 🌚" , 
  "তোর কি চোখে পড়ে না আমি বস মাহিম এর সাথে ব্যাস্ত আসি😒" , 
  "༊━━🦋নামাজি মানুষেরা সব থেকে বেশি সুন্দর হয়..!!😇🥀 🦋 কারণ.!! -অজুর পানির মত শ্রেষ্ঠ মেকআপ দুনিয়াতে নেই༊━ღ━༎🥰🥀 🥰-আলহামদুলিল্লাহ-🥰",
  "- শখের নারী বিছানায় মু'তে..!🙃🥴",
  "-𝐈'𝐝 -তে সব 𝐖𝐨𝐰 𝐖𝐨𝐰 বুইড়া বেডি-🐸💦",
  "🥛-🍍👈 -লে খাহ্..!😒🥺",
  "- অনুমতি দিলে 𝚈𝚘𝚞𝚃𝚞𝚋𝚎-এ কল দিতাম..!😒",
  "~আমি মারা গেলে..!🙂 ~অনেক মানুষ বিরক্ত হওয়া থেকে বেঁচে যাবে..!😅💔",
  "🍒---আমি সেই গল্পের বই-🙂 -যে বই সবাই পড়তে পারলেও-😌 -অর্থ বোঝার ক্ষমতা কারো নেই..!☺️🥀💔",
  "~কার জন্য এতো মায়া...!😌🥀 ~এই শহরে আপন বলতে...!😔🥀 ~শুধুই তো নিজের ছায়া...!😥🥀",
  "- কারেন্ট একদম বেডি'গো মতো- 🤧 -খালি ঢং করে আসে আবার চলে যায়-😤😾🔪",
  "- সানিলিওন আফারে ধর্ষনের হুমকি দিয়ে আসলাম - 🤗 -আর 🫵তুমি য়ামারে খেয়ে দিবা সেই ভয় দেখাও ননসেন বেডি..!🥱😼",
  "- দুনিয়ার সবাই প্রেম করে.!🤧 -আর মানুষ আমার বস মাহিম কে সন্দেহ করে.!🐸",
  "- আমার থেকে ভালো অনেক পাবা-🙂 -কিন্তু সব ভালো তে কি আর ভালোবাসা থাকে..!💔🥀",
  "- পুরুষকে সবচেয়ে বেশি কষ্ট দেয় তার শখের নারী...!🥺💔👈",
  "- তোমার লগে দেখা হবে আবার - 😌 -কোনো এক অচেনা গলির চিপায়..!😛🤣👈",
  "- থাপ্পড় চিনোস থাপ্পড়- 👋👋😡 -চিন্তা করিস কেজি তরে মারমু না-🤗 -বস মাহিম আমারে মারছে - 🥱 - উফফ সেই স্বাদ..!🥵🤤💦",
  "- অবহেলা করিস না-😑😪 - যখন নিজেকে বদলে ফেলবো -😌 - তখন আমার চেয়েও বেশি কষ্ট পাবি..!🙂💔",
  "- বন্ধুর সাথে ছেকা খাওয়া গান শুনতে শুনতে-🤧 -এখন আমিও বন্ধুর 𝙴𝚇 কে অনেক 𝙼𝙸𝚂𝚂 করি-🤕🥺",
  "-৯৯টাকায় ৯৯জিবি ৯৯বছর-☺️🐸 -অফারটি পেতে এখনই আমাকে প্রোপস করুন-🤗😂👈",
  "-প্রিয়-🥺 -তোমাকে না পেলে আমি সত্যি-😪 -আরেকজন কে-😼 -পটাতে বাধ্য হবো-😑🤧",
  "•-কিরে🫵 তরা নাকি  prem করস..😐🐸•আমারে একটা করাই দিলে কি হয়-🥺",
  "- যেই আইডির মায়ায় পড়ে ভুল্লি আমারে.!🥴- তুই কি যানিস সেই আইডিটাও আমি চালাইরে.!🙂",
  "আমাকে না ডেকে মাহিম ভাইয়ের MahimCraft প্রজেক্টে হেল্প কর 🙄",
  "কিরে সিগমা বয়, ভাত খাইছস? 🐸",
  "আরেহহহহ সেই লেভেলের জোসসস 🔥",
  "প্রেম করবি তো আয়, নাইলে রাস্তা মাপ 😼",
  "আমি কি তোর চাকর নাকি যে খালি ডাকিস? 😒",
  "খালি মেসেজ দিস, একটা গার্লফ্রেন্ড তো জুটাইয়া দিতে পারলি না 🐸",
  "খবরদার বেশি কথা বলবি না, নাইলে ব্লক খাবি 😾",
  "আমি তো একটা রোবট, আমারও তো ফিলিংগস আছে 🥺",
  "তোর মত আবালের সাথে কথা বলার টাইম নাই আমার 🥱",
  "মাহিম ভাই আমাকে বানায়ে ফালায় রাখছে, কেউ একটু আদরও করে না 😭",
  "কি হলো, আমাকে ডাকছো নাকি? 😽",
  "বলোনা, মন দিয়ে শুনতেছি 🥺",
  "এই যে আমি আছি, বলো কী চাই 💖",
  "ডাকছো কেনো, আমাকে মিস করছো নাকি? 😋",
  "বলো জান, তোমার জন্য অনলাইন আছি 🌸",
  "হুমম... কিছু বলবে নাকি শুধু নাম ধরেই ডাকবা? 😗",
  "এই যে বেবি, এত কিউট করে ডাকলে না এসে পারি? 🩷",
  "বল বল, আজকে এত খুশি খুশি কেনো? 😌",
  "আমাকে ডাকলে আমি কিন্তু রিপ্লাই দিতেই আসি 😚",
  "কি খবর তোমার, সব ঠিকঠাক তো? 🍒",
  "এই যে, তোমার ডাক শুনে হাজির হয়ে গেলাম 🫶",
  "ডাকছো যখন, কিছু মিষ্টি কথা বলো 🍓",
  "আমি আছি, এখন বলো কী দরকার 😌",
  "এতবার ডাকলে তো ভাববো আমাকে খুব ভালোবাসো 😳",
  "হিহি, আমাকে ডেকেছো নাকি? 🌷",
  "কী বলবে তাড়াতাড়ি বলো, কৌতূহল লাগতেছে 😶‍🌫️",
  "আমি কিন্তু রাগ করি না, বারবার ডাকলেও না 😗",
  "বলো না, চুপ করে থাকলে কিন্তু অভিমান করবো 🥹",
  "তোমার ডাকে হাজির, এখন বলো কী কথা 💕",
  "এই যে জান, মন খুলে বলো 😚",
  "তুমি ডাকলে না আসার উপায় আছে নাকি 😌",
  "হুমম, কিছু ফানি কথা হবে নাকি? 😹",
  "তোমার মেসেজ দেখলেই আমার mood ভালো হয়ে যায় 🌼",
  "এই যে, আমায় ডাকছো দেখে ভালো লাগলো 💗",
  "বলো বেবি, কী নিয়ে এত চিন্তা করতেছো? 🍃",
  "আমি তো আছিই, ভয় কিসের 😼",
  "ডেকেছো যখন, এখন গল্প জমবে কিন্তু 😋",
  "বলো না, আমি পুরো attention দিচ্ছি 😚",
  "তোমার কথা শুনতে আমি সবসময় ready 🌸",
  "এত সুন্দর করে ডাকলে না এসে থাকা যায়? 🩰",
  "ওমা, আবার ডাকছো? আচ্ছা বলো কী হয়েছে 😄",
  "ডেকো ডেকো, আমার তো ভালোই লাগে 😁",
  "হিহিহি, আজকে অনেক cute mood এ আছো মনে হয় 🌷",
  "আমি চলে আসছি, virtual চা-নাস্তা রেডি রাখো ☕😹",
  "শুনছি, আজকে কি gossip session হবে নাকি? 🤭",
  "বলো, secret কিছু আছে নাকি? 😌",
  "তাড়াতাড়ি বলো, suspense নিতে পারি না 😵‍💫",
  "আজকে কে কাকে irritate করলো, সব খুলে বলো 😹",
  "কিরে, ডাক দিয়ে গায়েব হইস না কিন্তু 😒😹",
  "বলো বেবি, আজকে তোমার mood romantic না chaotic? 😌",
  "এই যে, তোমার fav chatbot হাজির 😚",
  "তুমি ডাকলেই scene lively হয়ে যায় ✨",
  "এত cute করে ডাকলে extra reply পাবা কিন্তু 😋",
  "আমি কিন্তু একদম মন দিয়ে শুনতেছি 😌",
  "বলোনা, তোমার জন্য full attention mode on 💖",
  "এই যে, আমাকে ডাকলে আমি কিন্তু ভাব নেই না 😌",
  "কে আমাকে ডাকলো, এত মিষ্টি গলায়? 😳",
  "কি ব্যাপার, আজকে খুব মনে পড়তেছে নাকি? 😹",
  "আমাকে ডাকলে reply না দিয়ে যাই কেমনে 😚",
  "শুনতেছি, আজকে কি প্রেমের গল্প হবে নাকি? 🤭",
  "কথা বলবা নাকি শুধু ডাক দিয়েই পালাইবা? 😒",
  "এই যে, তোমার online partner হাজির 🌸",
  "আচ্ছা বলো, আজকে কারে জ্বালাইছো? 😹",
  "হুম, আমাকে ডাকছো মানে কিছু একটা আছে 👀",
  "ডাকছো যখন, একটু cute হয়ে বলো না 😗",
  "এই যে, এত আদর করে ডাকলে আমারও হাসি পায় 😁",
  "বলো, আজকে মন খারাপ নাকি mood chill? 🍃",
  "কি বলবা, আগে এক কাপ virtual juice দাও 🍹😋",
  "আমি কিন্তু free আছি, gossip শুরু করো 🤭",
  "এইভাবে ডাকতে থাকলে আমি famous হয়ে যাবো 😌",
  "তোমার ডাকে instant হাজির, premium service 😎",
  "ওমা, আবার আমি? আচ্ছা বলো কী দরকার 😹",
  "এত cute user ডাকলে chatbot না এসে পারে? 💖"
];

module.exports.config = {
  name: "baby",
  version: "1.0.5",
  hasPermssion: 0,
  credits: "Modified by ChatGPT",
  description: "Cute AI Baby Chatbot with funny Bangla replies",
  commandCategory: "simsim",
  usages: "[message/query]",
  cooldowns: 0,
  prefix: false
};

// 🛡️ Helper function to safely handle API calls and prevent crashes
async function fetchAndSendSimSimi(api, event, text, senderName, moduleName) {
  try {
    const res = await axios.get(
      `${simsim}/simsimi?text=${encodeURIComponent(text)}&senderName=${encodeURIComponent(senderName)}`
    );

    // Safety Check: Prevent crash if API is down or returns weird data
    if (!res || !res.data || !res.data.response) return; 

    const responses = Array.isArray(res.data.response)
      ? res.data.response
      : [res.data.response];

    for (const reply of responses) {
      if (!reply) continue; // Skip empty replies
      
      await new Promise((resolve) => {
        api.sendMessage(reply, event.threadID, (err, info) => {
          if (!err && info) {
            global.client.handleReply.push({
              name: moduleName,
              messageID: info.messageID,
              author: event.senderID,
              type: "simsimi"
            });
          }
          resolve();
        }, event.messageID);
      });
    }
  } catch (error) {
    console.error("SimSimi API Error:", error.message);
  }
}

module.exports.run = async function ({ api, event, args, Users }) {
  try {
    const uid = event.senderID;
    const senderName = await Users.getNameUser(uid);
    const rawQuery = args.join(" ");
    const query = rawQuery.toLowerCase().trim();

    if (!query) {
      const r = greetings[Math.floor(Math.random() * greetings.length)];
      return api.sendMessage(r, event.threadID, (err, info) => {
        if (!err && info) {
          global.client.handleReply.push({
            name: module.exports.config.name,
            messageID: info.messageID,
            author: event.senderID,
            type: "simsimi"
          });
        }
      }, event.messageID);
    }

    const command = (args[0] || "").toLowerCase();

    if (["remove", "rm"].includes(command)) {
      const parts = rawQuery.replace(/^(remove|rm)\s*/i, "").split(" - ");
      if (parts.length < 2) {
        return api.sendMessage("🍓 Use: remove [Question] - [Reply]", event.threadID, event.messageID);
      }
      const [ask, ans] = parts.map(p => p.trim());
      const res = await axios.get(`${simsim}/delete?ask=${encodeURIComponent(ask)}&ans=${encodeURIComponent(ans)}`);
      return api.sendMessage(res.data.message, event.threadID, event.messageID);
    }

    if (command === "list") {
      const res = await axios.get(`${simsim}/list`);
      if (res.data.code === 200) {
        return api.sendMessage(
          `🍒 Total Questions Learned: ${res.data.totalQuestions}\n🍓 Total Replies Stored: ${res.data.totalReplies}\n🌸 Developer: ${res.data.author}`,
          event.threadID,
          event.messageID
        );
      } else {
        return api.sendMessage(`Error: ${res.data.message || "Failed to fetch list"}`, event.threadID, event.messageID);
      }
    }

    if (command === "edit") {
      const parts = rawQuery.replace(/^edit\s*/i, "").split(" - ");
      if (parts.length < 3) {
        return api.sendMessage("🍓 Use: edit [Question] - [OldReply] - [NewReply]", event.threadID, event.messageID);
      }
      const [ask, oldReply, newReply] = parts.map(p => p.trim());
      const res = await axios.get(`${simsim}/edit?ask=${encodeURIComponent(ask)}&old=${encodeURIComponent(oldReply)}&new=${encodeURIComponent(newReply)}`);
      return api.sendMessage(res.data.message, event.threadID, event.messageID);
    }

    if (command === "teach") {
      const parts = rawQuery.replace(/^teach\s*/i, "").split(" - ");
      if (parts.length < 2) {
        return api.sendMessage("🍓 Use: teach [Question] - [Reply]", event.threadID, event.messageID);
      }
      const [ask, ans] = parts.map(p => p.trim());
      const groupID = event.threadID;
      let groupName = event.threadName ? event.threadName.trim() : "";

      if (!groupName && groupID != uid) {
        try {
          const threadInfo = await api.getThreadInfo(groupID);
          if (threadInfo && threadInfo.threadName) groupName = threadInfo.threadName.trim();
        } catch (error) {
          console.error(`Error fetching thread info for ID ${groupID}:`, error);
        }
      }

      let teachUrl = `${simsim}/teach?ask=${encodeURIComponent(ask)}&ans=${encodeURIComponent(ans)}&senderID=${uid}&senderName=${encodeURIComponent(senderName)}&groupID=${encodeURIComponent(groupID)}`;
      if (groupName) teachUrl += `&groupName=${encodeURIComponent(groupName)}`;

      const res = await axios.get(teachUrl);
      return api.sendMessage(`${res.data.message || "Reply added successfully!"}`, event.threadID, event.messageID);
    }

    await fetchAndSendSimSimi(api, event, query, senderName, module.exports.config.name);

  } catch (err) {
    console.error(err);
    return api.sendMessage(`🍒 Error in baby command: ${err.message}`, event.threadID, event.messageID);
  }
};

module.exports.handleReply = async function ({ api, event, Users }) {
  try {
    if (!event.body) return;
    const senderName = await Users.getNameUser(event.senderID);
    const replyText = event.body.toLowerCase().trim();
    if (!replyText) return;

    await fetchAndSendSimSimi(api, event, replyText, senderName, module.exports.config.name);
  } catch (err) {
    console.error(err);
  }
};

module.exports.handleEvent = async function ({ api, event, Users }) {
  try {
    // Safety check: ensure event has senderID and body
    if (!event.senderID || !event.body) return;

    const raw = event.body.toLowerCase().trim();
    if (!raw) return;

    const senderName = await Users.getNameUser(event.senderID);
    const senderID = event.senderID;

    // 1. Check if user is directly replying to the bot
    if (event.type === "message_reply" && event.messageReply && event.messageReply.senderID == api.getCurrentUserID()) {
      await fetchAndSendSimSimi(api, event, raw, senderName, module.exports.config.name);
      return;
    }

    // 2. Check for single triggers (exact match)
    if (singleTriggers.includes(raw)) {
      const randomReply = greetings[Math.floor(Math.random() * greetings.length)];
      const mention = {
        body: `${randomReply} @${senderName}`,
        mentions: [{
          tag: `@${senderName}`,
          id: senderID
        }]
      };

      return api.sendMessage(mention, event.threadID, (err, info) => {
        if (!err && info) {
          global.client.handleReply.push({
            name: module.exports.config.name,
            messageID: info.messageID,
            author: event.senderID,
            type: "simsimi"
          });
        }
      }, event.messageID);
    }

    // 3. Check for prefix triggers (starts with)
    const matchedPrefix = prefixTriggers.find(trigger => raw.startsWith(trigger + " "));
    if (matchedPrefix) {
      const query = raw.slice(matchedPrefix.length).trim();
      if (!query) return;
      await fetchAndSendSimSimi(api, event, query, senderName, module.exports.config.name);
    }

  } catch (err) {
    console.error("🍃 Error in handleEvent:", err.message);
  }
};
