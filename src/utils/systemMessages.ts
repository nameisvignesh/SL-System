/**
 * The System Message Pool
 * Voice: Terse, cold, formal, authoritative System from Solo Leveling.
 * Includes >=8 variants per event and English / Tamil localization.
 */

export interface SystemMessageItem {
  header: string;
  text: string;
}

export const SYSTEM_MESSAGES_EN = {
  questAlert: [
    { header: '[ QUEST ALERT ]', text: 'Daily Quest has arrived. Maintain discipline or face punitive action.' },
    { header: '[ SYSTEM DIRECTIVE ]', text: 'New mandatory objectives logged into your hunter registry.' },
    { header: '[ QUEST ARRIVAL ]', text: 'The System demands your progression today. Begin immediately.' },
    { header: '[ NOTIFICATION ]', text: 'Physical and mental conditioning tasks have been assigned.' },
    { header: '[ SYSTEM NOTICE ]', text: 'Inaction is not an option for an awakened player.' },
    { header: '[ QUEST LOG ]', text: 'Today’s trial awaits your execution. Sloth will be penalized.' },
    { header: '[ MANDATORY QUEST ]', text: 'The clock is ticking. Complete your objectives before midnight.' },
    { header: '[ SYSTEM ALERT ]', text: 'New daily parameters initialized. Prove your right to ascend.' },
  ],
  questComplete: [
    { header: '[ QUEST CLEARED ]', text: 'Objective fulfilled. XP and Gold credited to your registry.' },
    { header: '[ SYSTEM CONFIRMATION ]', text: 'Trial passed. Your stats edge closer to the next threshold.' },
    { header: '[ REWARD GRANTED ]', text: 'Effort logged. The System acknowledges your discipline.' },
    { header: '[ OBJECTIVE MET ]', text: 'Task completed without deviation. Gold deposited.' },
    { header: '[ SYSTEM UPDATE ]', text: 'Integrity verified. You have conquered today’s trial.' },
    { header: '[ QUEST ACCOMPLISHED ]', text: 'One more step toward the Monarch’s absolute domain.' },
    { header: '[ REGISTRY UPDATE ]', text: 'Performance recognized. Continue the grind without hesitation.' },
    { header: '[ TRIAL CONQUERED ]', text: 'Discipline maintained. The weak fall; the relentless rise.' },
  ],
  levelUp: [
    { header: '[ LEVEL UP ]', text: 'You have surpassed your former limits. Stat points granted.' },
    { header: '[ SYSTEM ANNOUNCEMENT ]', text: 'Vessel upgraded. Allocate your newly unlocked stat points.' },
    { header: '[ LIMIT BROKEN ]', text: 'Your soul capacity has expanded. HP and MP fully restored.' },
    { header: '[ RANK ASCENSION ]', text: 'Your power radiates with renewed intensity. Level increased.' },
    { header: '[ VESSEL FORGED ]', text: 'The System acknowledges your evolution. Power recognized.' },
    { header: '[ CAPACITY EXPANSION ]', text: 'Vital reserves regenerated to peak state. Choose your path.' },
    { header: '[ PLAYER EVOLUTION ]', text: 'Another step toward supremacy. Assign your attribute points.' },
    { header: '[ THRESHOLD SURPASSED ]', text: 'You are no longer who you were yesterday. Grow stronger.' },
  ],
  rewardGateAssigned: [
    { header: '[ SYSTEM PROTOCOL ]', text: 'Reward locked. Complete the designated gate quest to unlock.' },
    { header: '[ GATE TRIAL ACTIVE ]', text: 'Nothing in this realm is unearned. Conquer the gate first.' },
    { header: '[ ACCESS GATED ]', text: 'Pleasure requires sacrifice. Prove your discipline before claiming.' },
    { header: '[ SYSTEM LOCK ]', text: 'Gate Quest initialized. Clear the obstacle to unlock your reward.' },
    { header: '[ TRIAL OF DESIRE ]', text: 'Desire without effort is weakness. Complete the challenge.' },
    { header: '[ GATE DEPLOYED ]', text: 'The vault door requires proof of work. Finish the objective.' },
    { header: '[ SYSTEM DEMAND ]', text: 'Earn your feast. Complete the trial to trigger the claim window.' },
    { header: '[ RESTRICTION ENGAGED ]', text: 'Only those who conquer the gate may partake in the spoils.' },
  ],
  rewardUnlocked: [
    { header: '[ REWARD UNLOCKED ]', text: 'Gate cleared. Claim window timer activated. Enjoy guilt-free.' },
    { header: '[ ACCESS GRANTED ]', text: 'Gold deducted. You have rightfully earned this reward.' },
    { header: '[ VAULT OPENED ]', text: 'Discipline rewarded. Savor the fruit of your labor before time expires.' },
    { header: '[ SANCTIONED PLEASURE ]', text: 'Protocol satisfied. The System permits your indulgence.' },
    { header: '[ CLAIM WINDOW ACTIVE ]', text: 'Timer ticking. Claim your real-life reward with clean conscience.' },
    { header: '[ SYSTEM APPROVAL ]', text: 'Conquest validated. You fought for this moment; enjoy it.' },
    { header: '[ RIGHT SECURED ]', text: 'Unconditional clearance granted. Partake without lingering guilt.' },
    { header: '[ SPOILS DELIVERED ]', text: 'Effort exchanged for reward. Remember this taste when you fight next.' },
  ],
  warningPenalty: [
    { header: '[ WARNING ]', text: 'Discipline decayed. HP reduced and punitive measures prepared.' },
    { header: '[ PENALTY ZONE ]', text: 'Failure to complete required quests triggers the Survival Trial.' },
    { header: '[ SYSTEM SANCTION ]', text: 'Sloth has a cost. Gold docked and health penalized.' },
    { header: '[ PROTOCOL BREACH ]', text: 'Objectives neglected. Enter the Penalty Zone to redeem your status.' },
    { header: '[ SYSTEM WRATH ]', text: 'The System does not tolerate stagnation. Clear your penalty.' },
    { header: '[ DISCIPLINE FAILURE ]', text: 'Comfort won today. Pay the debt in sweat to regain access.' },
    { header: '[ RED GATE SEALED ]', text: 'All rewards locked until survival trial requirements are cleared.' },
    { header: '[ SEVERE WARNING ]', text: 'Continue on this trajectory and your streak will crumble.' },
  ],
  insufficientGold: [
    { header: '[ SYSTEM ADVISORY ]', text: 'Insufficient Gold points. Complete more quests to afford this item.' },
    { header: '[ VAULT RESTRICTION ]', text: 'Gold reserves inadequate. The System will not grant charity.' },
    { header: '[ FUND DEFICIT ]', text: 'You lack the currency of discipline. Grind more objectives.' },
    { header: '[ ACCESS DENIED ]', text: 'Balance insufficient. Suggested quests have been highlighted for you.' },
    { header: '[ INSUFFICIENT XP/GOLD ]', text: 'Return when your balance matches the price of discipline.' },
    { header: '[ ECONOMIC LOCK ]', text: 'Wealth is earned in sweat. Complete available trials first.' },
    { header: '[ TRANSACTION HALTED ]', text: 'Short on Gold. Conquer today’s dailies to close the gap.' },
    { header: '[ VALUE DEFICIENCY ]', text: 'The vault accepts only proof of action, not excuses.' },
  ],
};

export const SYSTEM_MESSAGES_TA = {
  questAlert: [
    { header: '[ தேடல் எச்சரிக்கை ]', text: 'இன்றைய பயிற்சி வந்துவிட்டது. ஒழுக்கத்தை நிலைநாட்டுங்கள் அல்லது தண்டனையை எதிர்கொள்ளுங்கள்.' },
    { header: '[ கணினி உத்தரவு ]', text: 'உங்கள் பதிவேட்டில் புதிய கட்டாய இலக்குகள் சேர்க்கப்பட்டுள்ளன.' },
    { header: '[ புதிய கடமை ]', text: 'உங்கள் முன்னேற்றத்தை கணினி கோருகிறது. உடனே தொடங்குங்கள்.' },
    { header: '[ அறிவிப்பு ]', text: 'உடல் மற்றும் மன உறுதிப்படுத்தும் பணிகள் ஒதுக்கப்பட்டுள்ளன.' },
    { header: '[ முக்கிய அறிவிப்பு ]', text: 'எழுச்சி பெற்ற வேட்டைக்காரனுக்கு சோம்பேறித்தனம் தகாது.' },
    { header: '[ இலக்கு தயார் ]', text: 'இன்றைய சவால் காத்திருக்கிறது. அலட்சியம் தண்டிக்கப்படும்.' },
    { header: '[ கட்டாயப் பணி ]', text: 'நேரம் ஓடுகிறது. நள்ளிரவுக்குள் உங்கள் இலக்குகளை முடியுங்கள்.' },
    { header: '[ எச்சரிக்கை ]', text: 'புதிய அளவுருக்கள் துவக்கப்பட்டன. உங்கள் பலத்தை நிரூபியுங்கள்.' },
  ],
  questComplete: [
    { header: '[ தேடல் நிறைவு ]', text: 'இலக்கு முடிந்தது. அனுபவ புள்ளிகளும் தங்கமும் சேர்க்கப்பட்டன.' },
    { header: '[ கணினி உறுதிப்படுத்தல் ]', text: 'பயிற்சி வெல்லப்பட்டது. உங்கள் நிலை அடுத்த நிலைக்கு நெருங்குகிறது.' },
    { header: '[ வெகுமதி வழங்கப்பட்டது ]', text: 'முயற்சி பதியப்பட்டது. உங்கள் ஒழுக்கத்தை கணினி அங்கீகரிக்கிறது.' },
    { header: '[ வெற்றி ]', text: 'தவறின்றி முடிக்கப்பட்டது. தங்கம் உங்கள் கணக்கில் வரவு வைக்கப்பட்டது.' },
    { header: '[ கணினி புதுப்பிப்பு ]', text: 'நாணயமான உழைப்பு. இன்றைய போரில் வென்றுவிட்டீர்கள்.' },
    { header: '[ சாதனை ]', text: 'மன்னனின் எல்லைக்குள் நுழைய இன்னும் ஓர் அடி முன்னேற்றம்.' },
    { header: '[ உறுதிப்பாடு ]', text: 'செயல்பாடு அங்கீகரிக்கப்பட்டது. தயக்கமின்றி முன்னேறுங்கள்.' },
    { header: '[ இலக்கு வெற்றி ]', text: 'ஒழுக்கம் காக்கப்பட்டது. பலவீனன் விழுவான், விடாமுயற்சியாளன் எழுவான்.' },
  ],
  levelUp: [
    { header: '[ நிலை உயர்வு ]', text: 'முந்தைய வரம்புகளைத் தகர்த்துவிட்டீர்கள். புதிய புள்ளிகள் கிடைத்துள்ளன.' },
    { header: '[ அதிகாரப்பூர்வ அறிவிப்பு ]', text: 'உங்கள் திறன் அதிகரித்துள்ளது. பண்புக்கூறு புள்ளிகளை ஒதுக்குங்கள்.' },
    { header: '[ வரம்பு முறிந்தது ]', text: 'ஆற்றல் விரிவடைந்தது. நலம் மற்றும் கவனம் முழுமையாக மீட்கப்பட்டது.' },
    { header: '[ அந்தஸ்து உயர்வு ]', text: 'உங்கள் சக்தி தீவிரமடைந்துள்ளது. புதிய நிலை எட்டப்பட்டது.' },
    { header: '[ மறுபிறவி ]', text: 'உங்கள் பரிணாமத்தை கணினி ஒப்புக்கொள்கிறது.' },
    { header: '[ புதிய சக்தி ]', text: 'ஆற்றல் முழுமையாக நிறைந்தது. உங்கள் பாதையைத் தேர்ந்தெடுங்கள்.' },
    { header: '[ வேட்டைக்காரன் உயர்வு ]', text: 'மேலாதிக்கத்தை நோக்கி முன்னேறுங்கள். புதிய பலத்தை விநியோகியுங்கள்.' },
    { header: '[ பலம் பெருகியது ]', text: 'நேற்றைய மனிதன் நீங்கள் இல்லை. இன்னும் வலுவாகுங்கள்.' },
  ],
  rewardGateAssigned: [
    { header: '[ வாயில் நெறிமுறை ]', text: 'வெகுமதி பூட்டப்பட்டுள்ளது. திறக்க வாயில் தேடலை முடியுங்கள்.' },
    { header: '[ வாயில் சவால் ]', text: 'இங்கே எதுவும் இலவசம் இல்லை. முதலில் சவாலை வெல்லுங்கள்.' },
    { header: '[ அணுகல் கட்டுப்பாடு ]', text: 'இன்பத்திற்கு தியாகம் தேவை. உரிமை கோருமுன் உழைப்பை நிரூபியுங்கள்.' },
    { header: '[ பூட்டு இயங்கியது ]', text: 'வாயில் பணி துவங்கியது. தடையை வென்று வெகுமதியை மீட்டெடுங்கள்.' },
    { header: '[ ஆசைக்கான சோதனை ]', text: 'உழைப்பற்ற ஆசை பலவீனம். சோதனையை முடியுங்கள்.' },
    { header: '[ வாயில் திறப்புப் பணி ]', text: 'வெகுமதி பெட்டகத்திற்கு உழைப்பின் சான்று தேவை.' },
    { header: '[ கணினி நிபந்தனை ]', text: 'விருந்தை சம்பாதியுங்கள். நேர வரம்பைத் திறக்க சவாலை வெல்லுங்கள்.' },
    { header: '[ கட்டுப்பாடு ]', text: 'வாயிலை வென்றவர்களுக்கே வெகுமதியை அனுபவிக்கும் உரிமை உண்டு.' },
  ],
  rewardUnlocked: [
    { header: '[ வெகுமதி திறக்கப்பட்டது ]', text: 'வாயில் வெல்லப்பட்டது. நேர கவுண்டவுன் துவங்கியது. குற்ற உணர்வின்றி அனுபவியுங்கள்.' },
    { header: '[ அனுமதி அளிக்கப்பட்டது ]', text: 'தங்கம் கழிக்கப்பட்டது. இந்த வெகுமதியை நீங்கள் நியாயமாக ஈட்டியுள்ளீர்கள்.' },
    { header: '[ பெட்டகம் திறந்தது ]', text: 'ஒழுக்கத்திற்கான பரிசு. நேரம் முடிவதற்குள் மகிழுங்கள்.' },
    { header: '[ அங்கீகரிக்கப்பட்ட இன்பம் ]', text: 'நிபந்தனை நிறைவுற்றது. கணினி உங்கள் மகிழ்ச்சியை அனுமதிக்கிறது.' },
    { header: '[ நேரக் கவுண்டவுன் ]', text: 'நேரம் ஓடுகிறது. தூய மனசாட்சியோடு வெகுமதியை அனுபவியுங்கள்.' },
    { header: '[ கணினி ஒப்புதல் ]', text: 'வெற்றி சரிபார்க்கப்பட்டது. இதற்காக போராடினீர்கள், அனுபவியுங்கள்.' },
    { header: '[ உரிமை பெறப்பட்டது ]', text: 'முழுமையான அனுமதி வழங்கப்பட்டது. எந்தக் குற்ற உணர்வும் இன்றி அனுபவியுங்கள்.' },
    { header: '[ வெகுமதி உறுதி ]', text: 'உழைப்பு பரிசாக மாறியது. அடுத்த போரின்போதும் இந்த சுவையை நினைவில் கொள்ளுங்கள்.' },
  ],
  warningPenalty: [
    { header: '[ எச்சரிக்கை ]', text: 'ஒழுக்கம் தளர்ந்தது. நலம் குறைந்தது மற்றும் தண்டனை நடவடிக்கை தயாராகிறது.' },
    { header: '[ தண்டனை மண்டலம் ]', text: 'இலக்குகளை முடிக்காததால் உயிர்வாழும் சோதனை துவக்கப்படுகிறது.' },
    { header: '[ கணினி தண்டனை ]', text: 'சோம்பேறித்தனத்திற்கு விலை உண்டு. தங்கம் மற்றும் நலம் அபராதம் விதிக்கப்பட்டது.' },
    { header: '[ விதிமீறல் ]', text: 'இலக்குகள் புறக்கணிக்கப்பட்டன. உங்கள் அந்தஸ்தை மீட்க தண்டனை மண்டலத்தில் நுழையுங்கள்.' },
    { header: '[ கணினி கோபம் ]', text: 'தேக்க நிலையை கணினி பொறுக்காது. உங்கள் தண்டனையை முடியுங்கள்.' },
    { header: '[ ஒழுக்கத் தோல்வி ]', text: 'இன்று சௌகரியம் வென்றது. மீண்டும் தகுதியடைய வியர்வையால் கடனை அடியுங்கள்.' },
    { header: '[ சிவப்பு வாயில் ]', text: 'தண்டனை பணி முடியும் வரை அனைத்து வெகுமதிகளும் முடக்கப்படும்.' },
    { header: '[ தீவிர எச்சரிக்கை ]', text: 'இதே நிலை தொடர்ந்தால் உங்கள் தொடர்ச்சி உடைந்துவிடும்.' },
  ],
  insufficientGold: [
    { header: '[ கணினி ஆலோசனை ]', text: 'போதிய தங்கம் இல்லை. இதை வாங்க மேலும் பணிகளை முடியுங்கள்.' },
    { header: '[ பெட்டகத் தடை ]', text: 'தங்க இருப்பு போதாது. கணினி எந்த தர்மமும் செய்யாது.' },
    { header: '[ இருப்புப் பற்றாக்குறை ]', text: 'ஒழுக்கத்தின் நாணயம் உங்களிடம் குறைவாக உள்ளது. மேலும் உழையுங்கள்.' },
    { header: '[ அனுமதி மறுக்கப்பட்டது ]', text: 'இருப்பு குறைவு. தங்கத்தை ஈட்ட தகுந்த பணிகள் சுட்டிக்காட்டப்பட்டுள்ளன.' },
    { header: '[ போதாத தங்கம் ]', text: 'ஒழுக்கத்தின் விலைக்கு சமமான தங்கம் சேர்ந்ததும் திரும்பி வாருங்கள்.' },
    { header: '[ பொருளாதாரப் பூட்டு ]', text: 'செல்வம் வியர்வையால் ஈட்டப்படுகிறது. பணிகளை முடித்து வாருங்கள்.' },
    { header: '[ நடவடிக்கை நிறுத்தம் ]', text: 'தங்கம் பற்றாக்குறை. இடைவெளியை நிரப்ப இன்றைய தினசரிப் பணிகளை வெல்லுங்கள்.' },
    { header: '[ மதிப்பு குறைவு ]', text: 'காரணங்களை அல்ல, உழைப்பின் சான்றுகளை மட்டுமே பெட்டகம் ஏற்கும்.' },
  ],
};

export function getRandomSystemMessage(
  category: keyof typeof SYSTEM_MESSAGES_EN,
  lang: 'en' | 'ta' = 'en'
): SystemMessageItem {
  const pool = lang === 'ta' ? SYSTEM_MESSAGES_TA[category] : SYSTEM_MESSAGES_EN[category];
  const idx = Math.floor(Math.random() * pool.length);
  return pool[idx];
}
