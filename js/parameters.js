// Yi-Chia Chen

// ######## ##     ## ########  ######## ########  #### ##     ## ######## ##    ## ########
// ##        ##   ##  ##     ## ##       ##     ##  ##  ###   ### ##       ###   ##    ##
// ##         ## ##   ##     ## ##       ##     ##  ##  #### #### ##       ####  ##    ##
// ######      ###    ########  ######   ########   ##  ## ### ## ######   ## ## ##    ##
// ##         ## ##   ##        ##       ##   ##    ##  ##     ## ##       ##  ####    ##
// ##        ##   ##  ##        ##       ##    ##   ##  ##     ## ##       ##   ###    ##
// ######## ##     ## ##        ######## ##     ## #### ##     ## ######## ##    ##    ##

const FORMAL = false; // XXX
const EXPERIMENT_NAME = 'sfRecog';
const EXPERIMENT_VERSION = 'pretestTracing';
const SUBJ_NUM_FILE = 'subjNum_' + EXPERIMENT_NAME + '_' + EXPERIMENT_VERSION + '.txt';
const TRIAL_FILE = 'trial_' + EXPERIMENT_NAME + '_' + EXPERIMENT_VERSION + '.txt';
const SUBJ_FILE = 'subj_' + EXPERIMENT_NAME + '_' + EXPERIMENT_VERSION + '.txt';
const VISIT_FILE = 'visit_' + EXPERIMENT_NAME + '_' + EXPERIMENT_VERSION + '.txt';
const ATTRITION_FILE = 'attrition_' + EXPERIMENT_NAME + '_' + EXPERIMENT_VERSION + '.txt';
const SAVING_SCRIPT = 'php/save.php';
const SUBJ_NUM_SCRIPT = 'php/subjNum.php';
const SAVING_DIR = FORMAL ? '../data/formal':'../data/testing';
const ID_GET_VARIABLE_NAME = 'sonacode';
const COMPLETION_URL= 'https://ucla.sona-systems.com/webstudy_credit.aspx?experiment_id=1859&credit_token=d7523faabcfb41709e13fb159059df7f&survey_code='; // XXX

//  ######  ########  #### ######## ######## ########  ####    ###
// ##    ## ##     ##  ##     ##    ##       ##     ##  ##    ## ##
// ##       ##     ##  ##     ##    ##       ##     ##  ##   ##   ##
// ##       ########   ##     ##    ######   ########   ##  ##     ##
// ##       ##   ##    ##     ##    ##       ##   ##    ##  #########
// ##    ## ##    ##   ##     ##    ##       ##    ##   ##  ##     ##
//  ######  ##     ## ####    ##    ######## ##     ## #### ##     ##

const VIEWPORT_MIN_W = 800;
const VIEWPORT_MIN_H = 600;
const INSTR_READING_TIME_MIN = 0.75;


// ######## ########  ####    ###    ##
//    ##    ##     ##  ##    ## ##   ##
//    ##    ##     ##  ##   ##   ##  ##
//    ##    ########   ##  ##     ## ##
//    ##    ##   ##    ##  ######### ##
//    ##    ##    ##   ##  ##     ## ##
//    ##    ##     ## #### ##     ## ########

const TRACE_TYPES = ['self', 'other']
const TRIGGER_TYPES = ['static', 'physical', 'social'];
const CONDITIONS = FACTORIAL_COND([TRACE_TYPES, TRIGGER_TYPES]);
const ORIENTATIONS = RANGE(0, 360, 20);
const PRACTICE_ORIENTATION_DICT = {'static': 200, 'physical': 60, 'social': 280};
const TRACE_DICT = {};
// from trace_[traceKey].js (total 3 x 18 files):
// TRACE['static000'] = [ [time1, {'x':posX, 'y':posY}], [time2, {'x':posX, 'y':posY}], ...... ];
// TRACE['physical000'] = [ [time1, {'x':posX, 'y':posY}], [time2, {'x':posX, 'y':posY}], ...... ];
// TRACE['social000'] = [ [time1, {'x':posX, 'y':posY}], [time2, {'x':posX, 'y':posY}], ...... ];
// key naming: [triggerType][000-340 orientation]

// TRACE['static_example'] = [ [time1, {'x':posX, 'y':posY}], [time2, {'x':posX, 'y':posY}], ...... ]; -- for instructions
// TRACE['static_prac'] = [ [time1, {'x':posX, 'y':posY}], [time2, {'x':posX, 'y':posY}], ...... ]; -- for practice trials
// TRACE['physical_prac'] = [ [time1, {'x':posX, 'y':posY}], [time2, {'x':posX, 'y':posY}], ...... ]; -- for practice trials
// TRACE['social_prac'] = [ [time1, {'x':posX, 'y':posY}], [time2, {'x':posX, 'y':posY}], ...... ]; -- for practice trials
// Rotate to fit the randomly selected orientation in practice

const BLOCK_N = 6;
const CONDITION_N = CONDITIONS.length;
const ORIENTATIONS_N = ORIENTATIONS.length;
const ORIENTATION_PER_CONDITION_PER_BLOCK = ORIENTATIONS_N / CONDITION_N;
const INTERTRIAL_INTERVAL = 0.5;

// var condition_orientation_array = Array(CONDITIONS.length).fill(ORIENTATIONS);
// function CREATE_TRIAL_LIST() {
//     let block_trial_dict = {}
//     for (let b=0; b<BLOCK_N; b++) {
//         let block_trial_list = [];
//         let block_selected_orientations = [];
//         for (let c=0; c<CONDITIONS.length; c++) {
//             let remaining_orientations = condition_orientation_array[c];
//             let selections = REMOVE_ARRAY_ELEMENTS_BASED_ON_ANOTHER_ARRAY(remaining_orientations, block_selected_orientations);
//             let selected = SAMPLE_W_REPLACEMENT(selections, ORIENTATION_PER_CONDITION_PER_BLOCK);
//             block_selected_orientations = block_selected_orientations.concat(selected);
//             condition_orientation_array[c] = REMOVE_ARRAY_ELEMENTS_BASED_ON_ANOTHER_ARRAY(remaining_orientations, selected);
//             let this_condition = CONDITIONS[c];
//             block_trial_list = block_trial_list.concat(selected_orientations.map(o =>
//                 { return {'traceType':this_condition[0], 'triggerType':this_condition[1], 'orientation':o, 'recycled':false}})
//             );
//         }
//         block_trial_dict[b] = SHUFFLE_ARRAY(block_trial_list);
//     }

//     let trial_list = [];
//     for (let i=0; i<BLOCK_N; i++) {
//         trial_list = trial_list.concat(block_trial_dict[i]);
//     }
//     return trial_list;
// } XXX
// const TRIAL_LIST = CREATE_TRIAL_LIST(); XXX

const TRIAL_LIST = [
    {'traceType':'self', 'triggerType':'physical', 'orientation':40, 'recycled':false},
    {'traceType':'other', 'triggerType':'social', 'orientation':40, 'recycled':false},
    {'traceType':'self', 'triggerType':'static', 'orientation':100, 'recycled':false},
    {'traceType':'other', 'triggerType':'physical', 'orientation':40, 'recycled':false},
    {'traceType':'self', 'triggerType':'social', 'orientation':40, 'recycled':false},
    {'traceType':'other', 'triggerType':'static', 'orientation':100, 'recycled':false}
]; // XXX

const TRIAL_ORIENTATION_DICT = {
    'static':100,
    'physical':40,
    'social':40
}; // XXX

const TRIAL_N = TRIAL_LIST.length;
// const REST_TRIAL_N = TRIAL_N/BLOCK_N; XXX
// const RECYCLE_COUNT_CAP = TRIAL_N/6; XXX

function CREATE_PRACTICE_LIST() {
    let practice_list = [];
    for (let c=0; c<CONDITIONS.length; c++) {
        let this_condition = CONDITIONS[c];
        practice_list.push({
            'traceType': this_condition[0],
            'triggerType': this_condition[1],
            'orientation': PRACTICE_ORIENTATION_DICT[this_condition[1]],
            'recycled': false
        });
    }
    return practice_list;
}

const PRACTICE_LIST = CREATE_PRACTICE_LIST();
const PRACTICE_TRIAL_N = PRACTICE_LIST.length;

function CREATE_SCRIPT_LIST() {
    let scripts = Object.entries(PRACTICE_ORIENTATION_DICT).map(function ([k, v], i) {
            return 'js/trace_'+k+'_'+('00'+v).slice(-3)+'.js';
        });
    // scripts.push('trace_static_example_000.js');
    // TRIGGER_TYPES.forEach(trigger => scripts.concat(ORIENTATIONS.map(ori => 'js/trace_'+trigger+'_'+('00'+ori).slice(-3)+'.js'))); XXX
    scripts = scripts.concat(Object.entries(TRIAL_ORIENTATION_DICT).map(function ([k, v], i) { // XXX
        return 'js/trace_'+k+'_'+('00'+v).slice(-3)+'.js';
        })
    );
    return scripts;
}

const SCRIPT_LIST = CREATE_SCRIPT_LIST();

// const SCRIPT_LIST = ['js/yc_trajectory.js', 'js/yc_trajectory_2.js', 'js/yc_trajectory_3.js', 'js/yc_trajectory_4.js'];

//  ######  ######## #### ##     ## ##     ## ##       ####
// ##    ##    ##     ##  ###   ### ##     ## ##        ##
// ##          ##     ##  #### #### ##     ## ##        ##
//  ######     ##     ##  ## ### ## ##     ## ##        ##
//       ##    ##     ##  ##     ## ##     ## ##        ##
// ##    ##    ##     ##  ##     ## ##     ## ##        ##
//  ######     ##    #### ##     ##  #######  ######## ####

const STIM_PATH = 'media/';
const IMG_LIST = [
    // 'line_thick_squ.png',
    // 'initial_display.jpg', // XXX create them
    // 'trace_display.jpg'
];
const VIDEO_LIST = [
    // 'game_demo.mp4',
    // 'tempo_demo.mp4' // XXX create them
];
const SOUND_LIST = [
    'metronome_80bpm_181beats_centered.mp3'
];
const SINEWAVE_WIDTH = 400;
const SINEWAVE_HEIGHT = 100;
const SINEWAVE_IMG_WIDTH = 400;
const SINEWAVE_IMG_HEIGHT = 400;
const PEAK_VALLEY_N = 7;
const PEAK_VALLEY_DIST = SINEWAVE_WIDTH / (PEAK_VALLEY_N-1);
const SINEWAVE_X_SCALING = (PEAK_VALLEY_N-1)*Math.PI/SINEWAVE_WIDTH;
const SINEWAVE_Y_SCALING = 2/SINEWAVE_HEIGHT;

const CANVAS_WIDTH = 600;
const CANVAS_HEIGHT = 600;
const SINEWAVE_IMG_TOP = (CANVAS_HEIGHT - SINEWAVE_IMG_HEIGHT) / 2;
const SINEWAVE_IMG_LEFT = (CANVAS_WIDTH - SINEWAVE_IMG_WIDTH) / 2;
const X_PADDING = (CANVAS_WIDTH - SINEWAVE_WIDTH) / 2;
const Y_PADDING = (CANVAS_HEIGHT - SINEWAVE_HEIGHT) / 2;

function SINEWAVE_FUNCTION(canvas_x) {
    const X = canvas_x - X_PADDING;
    const THETA = X*SINEWAVE_X_SCALING - Math.PI;
    let y = (Math.cos(THETA)+1) / SINEWAVE_Y_SCALING;
    if (THETA>4*Math.PI) {
        y = 2 / SINEWAVE_Y_SCALING;
    }
    const CANVAS_Y = Y_PADDING + (SINEWAVE_HEIGHT-y);
    return CANVAS_Y;
}

const MARK_DIAMETER = 14;
const OBJECT_DIAMETER = 40;
const MARK_X = X_PADDING - MARK_DIAMETER/2;
const MARK_Y = Y_PADDING + SINEWAVE_HEIGHT - MARK_DIAMETER/2;
const DESTINATION_X = X_PADDING + SINEWAVE_WIDTH + OBJECT_DIAMETER/2;
const DESTIMATION_Y = Y_PADDING;
const OBJECT_INITIAL_X = DESTINATION_X - OBJECT_DIAMETER/2;
const OBJECT_INITIAL_Y = DESTIMATION_Y - OBJECT_DIAMETER/2;

const TRACE_LINE_WIDTH = 2;
const TRACE_CAP = 'round';
const TRACE_COLOR = 'red';

function SET_TASK_ELEMENT_STYLE() {
    $('#task-box').css({'width': CANVAS_WIDTH+'px', 'height': CANVAS_HEIGHT+'px'});
    $('#sinewave').css({'top': SINEWAVE_IMG_TOP+'px', 'left': SINEWAVE_IMG_LEFT+'px', 'width': SINEWAVE_IMG_WIDTH+'px', 'height': SINEWAVE_IMG_HEIGHT+'px'});
    $('#start-mark').css({'top': MARK_Y+'px', 'left': MARK_X+'px', 'width': MARK_DIAMETER+'px', 'height': MARK_DIAMETER+'px'});
    $('#end-object').css({'top': OBJECT_INITIAL_Y+'px', 'left': OBJECT_INITIAL_X+'px', 'width': OBJECT_DIAMETER+'px', 'height': OBJECT_DIAMETER+'px'});
    $('#canvas-frame').css({'width': CANVAS_WIDTH+'px', 'height': CANVAS_HEIGHT+'px', 'border-width': OBJECT_DIAMETER+'px'});
    $('#canvas').width(CANVAS_WIDTH);
    $('#canvas').height(CANVAS_HEIGHT);
}

//  ######      ###    ##     ## ########
// ##    ##    ## ##   ###   ### ##
// ##         ##   ##  #### #### ##
// ##   #### ##     ## ## ### ## ######
// ##    ##  ######### ##     ## ##
// ##    ##  ##     ## ##     ## ##
//  ######   ##     ## ##     ## ########

const BPM = 80;
const BEAT_INTERVAL = 60/BPM;
const DEVIATION_LIMIT = PEAK_VALLEY_DIST;

const PHYSICAL_RADIUS = OBJECT_DIAMETER/2;
const SOCIAL_RADIUS = SINEWAVE_WIDTH/2;
const TRIGGER_DIST_DICT = {
    physical: PHYSICAL_RADIUS,
    social: SOCIAL_RADIUS,
    static: SOCIAL_RADIUS
};
const OBJECT_SPEED = 150;

// ########  ########    ###    ########  ##    ##
// ##     ## ##         ## ##   ##     ##  ##  ##
// ##     ## ##        ##   ##  ##     ##   ####
// ########  ######   ##     ## ##     ##    ##
// ##   ##   ##       ######### ##     ##    ##
// ##    ##  ##       ##     ## ##     ##    ##
// ##     ## ######## ##     ## ########     ##

var subj_options, instr_options, trial_options, game_options;

$(document).ready(function() {
    SET_TASK_ELEMENT_STYLE();
    subj_options = {
        subjNumFile: SUBJ_NUM_FILE,
        subjNumCallback: SUBJ_NUM_CALLBACK,
        titles: SUBJ_TITLES,
        viewportMinW: VIEWPORT_MIN_W,
        viewportMinH: VIEWPORT_MIN_H,
        savingScript: SAVING_SCRIPT,
        subjNumScript: SUBJ_NUM_SCRIPT,
        visitFile: VISIT_FILE,
        attritionFile: ATTRITION_FILE,
        subjFile: SUBJ_FILE,
        savingDir: SAVING_DIR,
        handleVisibilityChange: HANDLE_VISIBILITY_CHANGE
    };

    instr_options = {
        textBox: $('#instr-box'),
        textElement: $('#instr-text'),
        array: MAIN_INSTRUCTIONS_ARRAY,
        restInstruction: REST_INSTRUCTION,
        quizConditions: ['onlyQ']
    };

    trial_options = {
        titles: TRIAL_TITLES,
        pracTrialN: PRACTICE_TRIAL_N,
        trialN: TRIAL_N,
        // restTrialN: REST_TRIAL_N, XXX
        stimPath: STIM_PATH,
        dataFile: 'pre-post',
        savingScript: SAVING_SCRIPT,
        savingDir: SAVING_DIR,
        trialList: Array.from(TRIAL_LIST),
        pracList: Array.from(PRACTICE_LIST),
        intertrialInterval: INTERTRIAL_INTERVAL,
        updateFunc: TRIAL_UPDATE,
        trialFunc: TRIAL,
        endExptFunc: END_TASK
    };

    game_options = {
        canvasElement: $('#canvas'),
        lineWidth: TRACE_LINE_WIDTH,
        lineCap: TRACE_CAP,
        lineColor: TRACE_COLOR,
        frozenLineColor: 'gray',
        sinewave: $('#sinewave'),
        peakValleyN: PEAK_VALLEY_N,
        sinewaveWaveWidth: SINEWAVE_WIDTH,
        mark: $('#start-mark'),
        object: $('#end-object'),
        objectSpeed: OBJECT_SPEED,
        destinationX: DESTINATION_X,
        destinationY: DESTIMATION_Y,
        destinationDist: PHYSICAL_RADIUS,
        soundElement: $('#metronome')[0],
        triggerDistDict: TRIGGER_DIST_DICT,
        bpm: BPM,
        deviationLimit: DEVIATION_LIMIT,
        recognitionQElement: $('#recognition-q'),
        interruptCallback: INTERRUPT,
        gameEndCallback: GAME_END
    }

    LOAD_SCRIPT(0, SCRIPT_LIST, RUN_STUDY);
});