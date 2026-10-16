// Original practice templates, based on common on-air CW exchanges and abbreviations.
// These are fictional training exchanges, not records of actual stations or QSOs.
const SOURCES = [
  'https://www.skccgroup.com/member_services/beginners_corner/',
  'https://cwops.org/wp-content/uploads/2023/09/CW-Abbreviations.pdf',
  'https://www.arrl.org/quick-reference-operating-aids',
  'https://www.arrl.org/keeping-a-log',
]

const SCENES = [
  { id: 'all', label: '全部场景' },
  { id: 'calling', label: '呼叫与应答' },
  { id: 'report', label: '信号报告' },
  { id: 'identity', label: '姓名与呼号' },
  { id: 'location', label: '台址与网格' },
  { id: 'station', label: '电台与功率' },
  { id: 'antenna', label: '天线与架设' },
  { id: 'weather', label: '天气与温度' },
  { id: 'conditions', label: '传播与干扰' },
  { id: 'repeat', label: '重发与慢发' },
  { id: 'contest', label: '竞赛交换' },
  { id: 'portable', label: '户外与低功率' },
  { id: 'schedule', label: '约定与频率' },
  { id: 'qsl', label: '确认与日志' },
  { id: 'closing', label: '结束通联' },
  { id: 'ragchew', label: '日常交流' },
  { id: 'operating', label: '操作与练习' },
]

// Every entry is an independently authored exchange, not a permutation of a sentence.
// Ten short phrases and ten fuller exchanges per scene: 320 templates in total.
const GROUPS = {
  calling: {
    phrase: [
      'CQ DE {call}', 'CQ CQ K', '{otherCall} DE {call}', 'QRZ DE {call}',
      'CQ DX K', 'PSE K', 'TNX FER CALL', 'QRL?', 'ANY STN PSE', 'CQ QRS K',
    ],
    sentence: [
      'CQ CQ DE {call} {call} K',
      '{otherCall} DE {call} TNX FER CALL K',
      'CQ DX CQ DX DE {call} K',
      'QRL? IS THIS FREQ IN USE?',
      'QRZ? PSE UR CALL AGN DE {call}',
      'CQ QRS DE {call} PSE CALL AT {speed} WPM K',
      '{otherCall} DE {call} {greeting} TNX FER ANSWERING MY CQ K',
      'CQ CQ CQ DE {call} {call} {call} PSE K',
      'PSE THE STN ENDING {otherSuffix} CALL AGN DE {call} K',
      '{otherCall} DE {call} I HEARD UR CQ AND WUD LIKE A QSO K',
    ],
  },
  report: {
    phrase: [
      'UR RST {rst}', 'RST {rst} {rst}', 'SOLID CPY', 'UR SIGS STRONG',
      'WEAK BUT READABLE', 'NICE CLEAN TONE', 'TNX FER RPT', 'HW CPY?',
      'ALL CPY OK', 'VY GUD SIGS',
    ],
    sentence: [
      'UR RST {rst} {rst} HW CPY?',
      'TNX FER RPT UR RST IS {rst}',
      'UR SIGS ARE {signalDescription} HR TODAY',
      '{otherCall} DE {call} UR RST {rst} K',
      'SOLID CPY NOW TNX FER REPEATING UR RPT',
      'UR TONE IS CLEAN AND STABLE ON THIS BAND',
      'I COPY UR RST AS {receivedRst} PSE CFM',
      'UR SIGS ARE {signalDescription} ES UR RST IS {rst} K',
      '{otherCall} DE {call} {greeting} UR RST {rst} {rst} TNX FER NICE SIGS',
      'ALL CPY OK HR TNX FER THE REPORT UR RST {rst} ES NO QRM AT PRESENT K',
    ],
  },
  identity: {
    phrase: [
      'NAME {name}', 'OP {name}', 'MY CALL {call}', 'UR NAME?',
      'CALL AGN?', 'NAME {name} {name}', 'TNX {otherName}', 'NICE MEET U',
      'CALL ENDS {suffix}', 'PSE UR NAME',
    ],
    sentence: [
      'MY NAME IS {name} {name} K',
      'OP HR IS {name} PSE UR NAME',
      'MY CALL IS {call} {call} PSE CFM',
      'TNX {otherName} MY NAME IS {name}',
      'PSE CORRECT MY CALL TO {call} IN UR LOG',
      'GLAD TO MEET U {otherName} MY NAME IS {name}',
      '{otherCall} DE {call} NAME {name} ES QTH {qth} K',
      'I MISSED UR NAME PSE SEND IT ONCE MORE K',
      'TNX {otherName} THIS IS {name} IN {qth} NICE TO HEAR U AGN',
      'MY CALL ENDS {suffix} I WILL SEND IT AGN {call} {call} HW CPY?',
    ],
  },
  location: {
    phrase: [
      'QTH {qth}', 'GRID {grid}', 'QTH NR {qth}', 'PSE UR QTH',
      'HR IN {country}', 'LOC {grid}', 'HOME QTH {qth}', 'QTH SAME',
      'NEAR CITY CENTRE', 'QTH {qth} {qth}',
    ],
    sentence: [
      'MY QTH IS {qth} IN {country}',
      'GRID HR IS {grid} {grid} K',
      'I LIVE NEAR {qth} PSE UR QTH',
      'HOME QTH {qth} ES GRID {grid}',
      'QTH IS {qth} A LARGE CITY IN {country}',
      'PSE SEND UR GRID AGN I MISSED THE LAST TWO DIGITS',
      '{otherCall} DE {call} QTH {qth} {qth} ES NAME {name} K',
      'MY STATION IS AT HOME IN {qth} ES MY GRID IS {grid}',
      'TNX FER UR QTH I AM IN {qth} IN {country} GRID {grid} K',
      'QTH HR IS {qth} I HAVE LIVED HERE FER {yearsHere} YEARS ES ENJOY THE AREA',
    ],
  },
  station: {
    phrase: [
      'RIG {rig}', 'PWR {power} W', 'RUNNING {power} W', 'RIG HOME MADE',
      'BATTERY POWER', 'RX FILTER {filter} HZ', 'PSE UR RIG',
      'RIG WORKING FB', 'FULL BREAK IN', 'POWER SUPPLY OK',
    ],
    sentence: [
      'RIG HR {rig} ES PWR {power} W',
      'RUNNING {power} W TO A {antenna}',
      'MY RIG IS {rig} HW ABT URS?',
      'RX FILTER SET TO {filter} HZ TODAY',
      'PWR IS {power} W AND RIG IS {rig}',
      'THE RIG IS WORKING FB AFTER A SMALL REPAIR',
      'I USE A {rig} WITH AN EXTERNAL KEYER ES A {antenna}',
      'I JUST REDUCED POWER TO {lowPower} W PSE NEW RPT K',
      '{otherCall} DE {call} RIG {rig} PWR {power} W ANT {antenna} HW CPY?',
      'STATION HR IS {rig} RUNNING {power} W WITH A {antenna} UP {height} M K',
    ],
  },
  antenna: {
    phrase: [
      'ANT {antenna}', 'ANT UP {height} M', 'SWR {swr}', 'WIRE ANTENNA',
      'PSE UR ANT', 'FEEDER IS COAX', 'NEW ANT TODAY',
      'ANT IN GARDEN', 'TUNER IN LINE', 'BEAM HEADING {bearing}',
    ],
    sentence: [
      'ANT HR IS A {antenna}',
      'ANTENNA IS UP {height} M ABOVE GROUND',
      'SWR IS {swr} ON THIS BAND',
      'USING A {antenna} FED WITH COAX',
      'I PUT UP A NEW {antenna} YESTERDAY',
      'THE ANTENNA IS IN A TREE BEHIND THE HOUSE',
      'ANT HR IS A {antenna} UP {height} M HW ABT UR ANT?',
      'THE WIND MOVED MY ANTENNA BUT SWR IS STILL {swr}',
      'I AM TESTING A NEW {antenna} TODAY PSE TELL ME HW SIGS COMPARE',
      'MY {antenna} IS UP {height} M ES FED WITH COAX TNX FER THE ANT INFO K',
    ],
  },
  weather: {
    phrase: [
      'WX {weather}', 'TEMP {temperature} C', 'WIND {wind} KPH',
      'WX HR {weather}', 'PSE UR WX', 'RAIN ALL DAY',
      'CLEAR SKY', 'SUNNY ES WARM', 'COLD THIS MORNING', 'WX IMPROVING',
    ],
    sentence: [
      'WX HR {weather} ES TEMP {temperature} C',
      'TEMP NOW {temperature} C IN {qth}',
      'WX TODAY IS {weather} HW ABT UR WX?',
      'WIND SPEED IS {wind} KPH AT PRESENT',
      'IT HAS BEEN RAINING SINCE EARLY THIS MORNING',
      'THE SKY IS CLEAR ES THE WIND IS LIGHT',
      'WX HR IN {qth} IS {weather} TEMP {temperature} C K',
      'A STORM IS COMING SO I WILL CLOSE THE STATION SOON',
      'WX {weather} TEMP {temperature} C ES WIND {wind} KPH AT MY QTH TODAY',
      'THE RAIN STOPPED AN HOUR AGO ES I AM BACK ON THE AIR TNX FER UR WX INFO',
    ],
  },
  conditions: {
    phrase: [
      'BAND OPEN', 'QSB HR', 'QRM ON FREQ', 'QRN VY STRONG',
      'CONDX IMPROVING', 'NO QRM HR', 'SIGS FADING', 'BAND VY QUIET',
      'LONG PATH OPEN', 'NOISE LEVEL HIGH',
    ],
    sentence: [
      'BAND IS OPEN TO {dxCountry}',
      'QSB ON UR SIGS PSE RPT',
      'QRM HR FROM A NEARBY STN',
      'CONDX ARE IMPROVING ON {band} M',
      'NOISE LEVEL IS HIGH BUT I CAN COPY U',
      'SIGS WERE WEAK EARLIER BUT ARE COMING UP NOW',
      'HEAVY QRN HR DUE TO A STORM IN THE AREA',
      'I HEARD SEVERAL STNS FROM {dxCountry} ON {band} M TODAY',
      'THE BAND IS VY QUIET THIS MORNING ES UR SIGS ARE EASY TO COPY',
      'QSB IS GETTING WORSE HR PSE SEND UR LAST MESSAGE AGN A LITTLE SLOWER K',
    ],
  },
  repeat: {
    phrase: [
      'PSE AGN', 'PSE QRS', 'QRS {speed} WPM', 'RPT UR CALL',
      'NAME AGN?', 'QTH AGN?', 'PSE RPT RST', 'MISSED LAST WORD',
      'ALL AFTER NAME', 'PSE SEND SLOWER',
    ],
    sentence: [
      'PSE SEND UR CALL AGN K',
      'SRI I MISSED UR QTH PSE AGN',
      'PSE QRS TO {speed} WPM TNX',
      'RPT ALL AFTER UR NAME PSE',
      'PSE SEND THE LAST WORD ONE MORE TIME',
      'I COPIED {otherCall} IS THAT CORRECT?',
      'SRI QRM HR PSE SEND UR RPT ES NAME AGN',
      'I AM NEW TO CW PSE SEND SLOWLY ES LEAVE MORE SPACE',
      '{otherCall} DE {call} SRI I MISSED THE FIRST PART OF UR MESSAGE PSE RPT K',
      'TNX FER UR PATIENCE I COPIED THE CALL ES RST BUT NEED UR QTH AGN PSE K',
    ],
  },
  contest: {
    phrase: [
      'CQ TEST', 'TEST DE {call}', '{contestRst} {serial}', 'NR {serial}',
      'SERIAL AGN?', 'TU {call}', 'QSO B4', 'CQ ZONE {zone}',
      'PSE NR AGN', 'EXCHANGE CFM',
    ],
    sentence: [
      'CQ TEST DE {call} {call}',
      '{otherCall} {contestRst} {serial} {serial}',
      'UR NR {serial} {serial} K',
      '{otherCall} {contestRst} {zone} TU',
      'SRI NR AGN PSE I MISSED IT',
      'CORRECT NR IS {serial} PSE CFM',
      '{otherCall} DE {call} UR {contestRst} NR {serial} K',
      'TU FER NR {receivedSerial} UR {contestRst} NR {serial} K',
      'I HAVE U IN THE LOG ALREADY TNX ES GL IN TEST',
      'CQ TEST DE {call} {call} PSE CALL {otherCall} UR {contestRst} NR {serial} TU',
    ],
  },
  portable: {
    phrase: [
      'CQ DE {portableCall}', 'QRP {lowPower} W', 'BATTERY {voltage} V',
      'PORTABLE TODAY', 'ANT IN TREE', 'OPERATING OUTDOORS', 'NEAR THE RIVER',
      'ON A HILLTOP', 'SOLAR POWER', 'MOBILE DE {mobileCall}',
    ],
    sentence: [
      'CQ CQ DE {portableCall} K',
      'RUNNING QRP AT {lowPower} W TODAY',
      'PORTABLE NEAR {qth} WITH A WIRE ANT',
      'BATTERY IS AT {voltage} V NOW',
      'I AM OPERATING FROM A HILLTOP TODAY',
      'QRP RIG {portableRig} ES PWR {lowPower} W',
      'MY PORTABLE ANTENNA IS A DIPOLE UP {portableHeight} M IN A TREE',
      '{otherCall} DE {portableCall} TNX FER COPYING MY {lowPower} W SIGS K',
      'I AM CAMPING NEAR {qth} ES USING A {portableRig} WITH A SMALL BATTERY',
      'PORTABLE HR RUNNING {lowPower} W TO A WIRE IN A TREE BATTERY {voltage} V ES WX {weather} K',
    ],
  },
  schedule: {
    phrase: [
      'QSY {frequency}', 'SKED {utc} UTC', 'QRG {frequency}', 'CU TOMORROW',
      'TRY {band} M', 'UP {offset}', 'LISTENING HERE', 'PSE WAIT',
      'SAME TIME TOMORROW', 'FREQ IS CLEAR',
    ],
    sentence: [
      'PSE QSY TO {frequency} KHZ',
      'CAN WE MEET AT {utc} UTC?',
      'I WILL LISTEN ON {frequency} KHZ',
      'CU TOMORROW ON {band} M K',
      'PSE WAIT A MOMENT WHILE I CHECK THE FREQ',
      'LET US TRY THE SAME FREQ TOMORROW AT {utc} UTC',
      'QRM HR PSE QSY UP {offset} KHZ ES CALL ME AGN',
      'MY SKED IS AT {utc} UTC ON {frequency} KHZ PSE CFM',
      'I CAN BE ON {band} M AT {utc} UTC TOMORROW IF THAT IS OK FER U',
      '{otherCall} DE {call} PSE QSY TO {frequency} KHZ I WILL CALL U THERE IN TWO MINUTES K',
    ],
  },
  qsl: {
    phrase: [
      'QSL VIA BURO', 'QSL DIRECT', 'LOTW OK', 'TNX FER QSL',
      'LOG UPDATED', 'QSO CFM', 'PSE QSL', 'CARD RECEIVED',
      'UTC {utc}', 'PSE CFM CALL',
    ],
    sentence: [
      'QSL IS OK VIA THE BURO',
      'I WILL UPLOAD THE LOG TO LOTW',
      'TNX FER UR CARD IT ARRIVED TODAY',
      'QSO CFM AT {utc} UTC K',
      'PSE CHECK MY CALL {call} IN UR LOG',
      'I HAVE UR CALL AS {otherCall} PSE CFM',
      'PSE QSL VIA BURO ES I WILL SEND MY CARD SOON',
      'TNX FER THE QSO I WILL UPDATE MY ONLINE LOG TONIGHT',
      'I LOGGED UR CALL {otherCall} ES RST {rst} AT {utc} UTC PSE CFM',
      '{otherCall} DE {call} ALL INFO IS IN THE LOG TNX FER A NICE QSO ES PSE QSL K',
    ],
  },
  closing: {
    phrase: [
      'TNX FER QSO', '73 ES GL', 'CU AGN', 'HPE CU SOON',
      'BEST DX', 'MUST QRT', 'TNX FER CHAT', 'HAVE NICE DAY',
      'CUL {otherName}', 'GN ES 73',
    ],
    sentence: [
      'TNX FER NICE QSO ES 73',
      'HPE CU AGN SOON ON CW',
      'MUST QRT NOW TNX FER CHAT',
      'BEST 73 TO U ES UR FAMILY',
      '{otherCall} DE {call} TNX ES 73',
      'HAVE A NICE DAY ES GUD LUCK WITH DX',
      'TNX {otherName} FER A PLEASANT CHAT I MUST GO NOW',
      'THE FAMILY IS CALLING SO I MUST QRT TNX FER QSO',
      'HPE TO HEAR U AGN ON {band} M TNX FER UR PATIENCE ES 73',
      '{otherCall} DE {call} TNX FER THE NICE QSO {otherName} HPE CU AGN SOON BEST 73 ES GL',
    ],
  },
  ragchew: {
    phrase: [
      'AGE {age}', 'HAM SINCE {licensedYear}', 'RETIRED NOW', 'ENJOY CW',
      'HOBBY IS {hobby}', 'WORKING TODAY', 'NICE WEEKEND', 'FIRST QSO TODAY',
      'TIME FER COFFEE', 'FAMILY ALL WELL',
    ],
    sentence: [
      'I HAVE BEEN A HAM SINCE {licensedYear}',
      'AGE HR {age} ES HOBBY IS {hobby}',
      'I ENJOY CW AND BUILDING SIMPLE RADIOS',
      'THIS IS MY FIRST QSO TODAY',
      'I USUALLY GET ON THE AIR AFTER WORK',
      'MY OTHER HOBBY IS {hobby} HW ABT U?',
      'I HAVE BEEN BUSY THIS WEEK BUT FOUND SOME TIME FER CW',
      'I BECAME A HAM IN {licensedYear} ES STILL ENJOY EVERY CW QSO',
      'TNX {otherName} I ENJOY {hobby} WHEN I AM NOT ON THE RADIO HW ABT UR HOBBIES?',
      'IT IS NICE TO SPEND A QUIET EVENING ON CW ES MEET FRIENDS FROM OTHER COUNTRIES K',
    ],
  },
  operating: {
    phrase: [
      'PSE QRS TNX', 'SPEED {speed} WPM', 'STRAIGHT KEY', 'USING A PADDLE',
      'NEW TO CW', 'PRACTICE EVERY DAY', 'SEND MORE SPACE', 'KEYER READY',
      'FIRST CW QSO', 'TNX FER HELP',
    ],
    sentence: [
      'I AM LEARNING CW PSE QRS',
      'MY SPEED IS ABT {speed} WPM',
      'I USE A STRAIGHT KEY TODAY',
      'PSE LEAVE MORE SPACE BETWEEN WORDS',
      'TNX FER HELP THIS IS MY FIRST CW QSO',
      'I PRACTICE COPYING CALLS FOR A FEW MINUTES EVERY DAY',
      'I AM USING A PADDLE ES AN ELECTRONIC KEYER SET TO {speed} WPM',
      'UR SENDING IS VY CLEAR ES EASY TO COPY TNX FER SLOWING DOWN',
      'MY GOAL IS TO COPY A FULL QSO WITHOUT WRITING EVERY LETTER DOWN ON PAPER',
      '{otherCall} DE {call} TNX FER THE CW PRACTICE I AM GETTING BETTER AT COPYING CALLS ES NUMBERS K',
    ],
  },
}

const PATTERNS = []
SCENES.filter(scene => scene.id !== 'all').forEach(scene => {
  ;['phrase', 'sentence'].forEach(type => {
    GROUPS[scene.id][type].forEach((template, index) => {
      PATTERNS.push({ id: `${scene.id}-${type}-${index + 1}`, scene: scene.id, type, template })
    })
  })
})

const WORDS = (`
  CQ DE ES TU CU CW DX WX RX TX OM YL FB GM GA GE GN GL HW HR NR
  OK ON UP AS AT BE BY DO GO IF IN IS IT ME MY NO OF OR SO TO US WE
  ABT AGN ANT BFO CFM CLG CON CPY CQ CQD CUL FER FREQ GND GUD HAM HPE
  LOG LOW NEW NOW OFF OLD ONE OUT PSE PWR QRG QRL QRM QRN QRO QRP QRS
  QRT QRV QRX QRZ QSB QSK QSL QSO QSY QTH RIG RPT RST SIG SRI STN THE
  TNX TWO URS VFO VY WAT YRS ALL AND ARE ASK BAD BIG BUT CAN DAY DID END
  FAR FEW FOR GET GOT HAD HAS HIM HIS HOT HOW KEY LET LOT MAY NET NOT OUR
  OWN RED RUN SAY SEE SET SHE SKY SUN TEN TOP TRY USE WAS WAY WET WHO WHY
  WIN YES YET YOU AIR AGE BAR BAT BUY CAR DRY EAR EYE FOG FUN JOB KIT MAN
  BUSY CALL CARD CHAT CITY CODE COIL COLD COME COPY DATA DEAR DOWN EASY
  ECHO FEED FINE FREE FROM FULL GAIN GIVE GLAD GOOD GUST HAVE HEAR HEAT
  HELP HERE HIGH HOME HOPE HOUR INTO JUST KEEP KNOW LAST LATE LEFT LIFE
  LIKE LINE LONG LOOP MADE MAIN MAKE MANY MEAN MILE MODE MORE MOST MOVE
  MUCH MUST NAME NEAR NEED NEXT NICE NODE NOON NOTE ONLY OPEN OVER PART
  PAST PEAK PLAN PLOT PLUS POOR PORT QSL QTH RAIN READ REAL RISE ROAD ROOM
  SAME SAVE SEND SENT SIDE SLOW SOME SOON STAY STOP SURE TAKE TELL TEST
  THAN THAT THEM THEN THEY THIS TIME TONE TUNE TURN TYPE VERY WAIT WALK
  WARM WAVE WEEK WELL WENT WERE WHAT WHEN WILL WIND WIRE WITH WORK YEAR
  YOUR ZERO BAND BEAM BEST BOTH DONE EACH EVEN EVER FACE FACT FAST FIND
  FIVE FOUR GRID HILL LAKE LAND LESS LIVE LOOK LOSS LOST MUCH NINE ONCE
  ALSO BACK BEEN BLUE BOOK CAFE CLUB EAST HAND HARD HEAD LONG LOVE WEST
  ABOUT ABOVE AFTER AGAIN AGREE AHEAD ALONG AMPS AUDIO BEGIN BELOW BREAK
  BROAD BUILD BUILT CABLE CHAIR CHECK CLEAR CLOSE CLOUD COAX CODES COULD
  COUNT DAILY DELAY DOING EARLY EARTH EIGHT ENJOY EVERY EXACT EXTRA FIELD
  FIRST FIXED FOCUS FOUND FRONT GOING GREAT GREEN GROUP HAPPY HEARD HEAVY
  HERTZ HOUSE HOURS INPUT KILOS KNOWN LARGE LATER LEARN LEVEL LIGHT LOCAL
  LUNCH MAKER MATCH MAYBE METAL METER MODEL MORSE MOUNT MOUTH MOVED NEVER
  NIGHT NOISE NORTH OFTEN OLDER OPERA OTHER OWNER PANEL PAPER PARTS PAUSE
  PHASE PHONE PLACE POINT POWER PROBE QUICK QUIET RADIO RANGE READY REPLY
  RESET RIGHT RIVER ROUND SEVEN SHACK SHALL SHAPE SHORT SINCE SLEEP SMALL
  SOLAR SOLID SOUND SOUTH SPACE SPEED START STATE STILL STORE STORM STUDY
  SUNNY SWEET TAKEN THANK THEIR THERE THESE THING THINK THIRD THOSE THREE
  TODAY TOTAL TOWER TRAIL TRAIN TRIED TRULY TUNED TUNER UNDER UNTIL UPPER
  USING USUAL VALUE VISIT VOICE WATTS WAVES WHERE WHICH WHILE WHITE WHOLE
  WIDTH WIRES WOMAN WORDS WORLD WORRY WOULD WRITE WRONG YEARS YOUNG
  ACTIVE ACTUAL ADVICE ALMOST ALWAYS ANSWER AROUND AUTUMN BACKUP BETTER
  BRIGHT BROKEN BUFFER CALLED CENTRE CHANCE CHANGE CHOICE CLOSED COUPLE
  COURSE CUSTOM DEVICE DIPOLE DIRECT DOUBLE DURING EFFECT EFFORT ELEVEN
  ENABLE ENDING ENERGY ENOUGH EUROPE FAMILY FASTER FELLOW FIELDS FILTER
  FINISH FOLLOW FORMER FOURTH FRIEND GARDEN GROUND GROUPS GROWTH HANDLE
  HEALTH HEIGHT HELPER HIGHER INSIDE ISLAND ITSELF KEYING KEYPAD LADDER
  LATEST LEADER LENGTH LETTER LISTEN LITTLE LOGGED LONGER LOWEST MANUAL
  MEMBER MEMORY METERS MINUTE MOBILE MODERN MONDAY MOSTLY MOVING MUSEUM
  NARROW NATURE NEARBY NEEDED NUMBER ONLINE OUTPUT PADDLE PEOPLE PERIOD
  PLEASE POCKET PUBLIC RATHER READER REALLY REASON RECENT RECORD REPEAT
  REPORT RESULT RETURN ROUTER SAFETY SCHOOL SECOND SELECT SENDER SERIAL
  SHOULD SIGNAL SIMPLE SINGLE SLOWER SOURCE SPEECH SPRING SQUARE STABLE
  STRONG SUDDEN SUMMER SUNDAY SWITCH SYSTEM THANKS TIMING TRAVEL TRIPLE
  TUNING TWENTY USEFUL VALLEY VOLUME WARMER WEIGHT WINDOW WINTER WORKED
  ALREADY AMATEUR ANOTHER ANTENNA ARRIVED BATTERY BECAUSE BETWEEN CALLING
  CAREFUL CENTRAL CIRCUIT CLIMATE COMPACT CONTACT CORRECT COUNTRY CURRENT
  DIGITAL DYNAMIC EVENING EXAMPLE EXCITED FACTORY FEEDING FEEDLINE FINALLY
  FRIENDS FURTHER GETTING GOODBYE HEARING HELPFUL HOLDING HOLIDAY IMPROVE
  KEEPING LEARNER LETTERS LICENSE LOCATOR LOOKING MACHINE MESSAGE MINUTES
  MORNING NATURAL NOTHING NUMBERS OUTDOOR OUTSIDE PARTNER PATTERN PERFECT
  PICTURE PLANNED PLEASED PRACTICE PREPARE PROBLEM PROGRAM PROJECT QUALITY
  QUARTER READING RECEIVE REDUCED REGULAR REPLIED REQUEST RETIRED RUNNING
  SEVERAL SENDING SETTING SHORTER SILENCE SLOWEST SOMEONE SPECIAL STATION
  STOPPED STUDENT SUPPORT SURFACE THROUGH TONIGHT TROUBLE TUESDAY UNKNOWN
  USUALLY VARIOUS VIRTUAL VOLTAGE WALKING WEATHER WEEKEND WELCOME WITHOUT
  WORKING WRITTEN YESTERDAY ACCURACY ACTIVITY AMPLIFIER ANYTHING APPROACH
  BUILDING CALLSIGN CAPACITY COMPLETE COMPUTER CONDENSE CONDENSED CONNECT
  CONTEST DECREASE DISTANCE ELECTRIC ENCLOSURE EXCHANGE EXERCISE FEEDBACK
  FINISHED FREQUENCY HARDWARE HEADPHONES INCREASE INTERVAL KEYBOARD LANGUAGE
  LEARNING LOCATION MAGNETIC MEASURED MEMORIES MODIFIED MULTIBAND OPERATOR
  ORDINARY OVERHEAD PORTABLE POSSIBLE PRACTICE PREVIOUS PROGRESS RECEIVED
  RECEIVER RECOVERY REDUCING RELIABLE REPEATED RESONANT SATURDAY SCHEDULE
  SOFTWARE SOLUTION SPEAKING STANDARD STRAIGHT STRENGTH SUPPLIED THURSDAY
  TOGETHER TRAINING VERTICAL WATCHING WEDNESDAY WIRELESS WORKSHOP
`).trim().split(/\s+/).filter((word, index, words) => (
  /^[A-Z]{2,8}$/.test(word) && words.indexOf(word) === index && !['AS', 'AR', 'SK', 'BT', 'KN', 'CQD'].includes(word)
))

module.exports = { PATTERNS, SCENES, WORDS, SOURCES }
