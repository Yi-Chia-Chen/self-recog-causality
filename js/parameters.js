// Yi-Chia Chen

// ######## ##     ## ########  ######## ########  #### ##     ## ######## ##    ## ########
// ##        ##   ##  ##     ## ##       ##     ##  ##  ###   ### ##       ###   ##    ##
// ##         ## ##   ##     ## ##       ##     ##  ##  #### #### ##       ####  ##    ##
// ######      ###    ########  ######   ########   ##  ## ### ## ######   ## ## ##    ##
// ##         ## ##   ##        ##       ##   ##    ##  ##     ## ##       ##  ####    ##
// ##        ##   ##  ##        ##       ##    ##   ##  ##     ## ##       ##   ###    ##
// ######## ##     ## ##        ######## ##     ## #### ##     ## ######## ##    ##    ##

const FORMAL = false; // XXX
const EXPERIMENT_NAME = "sfRecog";
const EXPERIMENT_VERSION = "pretestTracing";
const SUBJ_NUM_FILE =
    "subjNum_" + EXPERIMENT_NAME + "_" + EXPERIMENT_VERSION + ".txt";
const TEMPO_PRACTICE_FILE =
    "tempoPractice_" + EXPERIMENT_NAME + "_" + EXPERIMENT_VERSION + ".txt";
const TRIAL_FILE =
    "trial_" + EXPERIMENT_NAME + "_" + EXPERIMENT_VERSION + ".txt";
const SUBJ_FILE = "subj_" + EXPERIMENT_NAME + "_" + EXPERIMENT_VERSION + ".txt";
const VISIT_FILE =
    "visit_" + EXPERIMENT_NAME + "_" + EXPERIMENT_VERSION + ".txt";
const ATTRITION_FILE =
    "attrition_" + EXPERIMENT_NAME + "_" + EXPERIMENT_VERSION + ".txt";
const SAVING_SCRIPT = "php/save.php";
const SUBJ_NUM_SCRIPT = "php/subjNum.php";
const SAVING_DIR = FORMAL ? "../data/formal" : "../data/testing";
const ID_GET_VARIABLE_NAME = "sonacode";
const COMPLETION_URL =
    "https://ucla.sona-systems.com/webstudy_credit.aspx?experiment_id=1859&credit_token=d7523faabcfb41709e13fb159059df7f&survey_code="; // XXX

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

const TRACE_TYPES = ["self", "other"];
const TRIGGER_TYPES = ["static", "physical", "social"];
const CONDITIONS = FACTORIAL_COND([TRACE_TYPES, TRIGGER_TYPES]);
const ORIENTATIONS = RANGE(0, 360, 30);
const PRACTICE_ORIENTATION_DICT = { static: 210, physical: 60, social: 270 };
const TRACE_DICT = {};
const OTHER_TRACE_VERSION_N = 3;
// for formal: from trace_[triggerType]_[condition]_[version].js (total 3 x 3 x 12 files)
// for pilot: from trace_static_[orientation]_[version].js (total 3 x 12 files)
// TRACE['static0_0'] = [ [time1, {'x':posX, 'y':posY}], [time2, {'x':posX, 'y':posY}], ...... ];
// TRACE['physical30_1'] = [ [time1, {'x':posX, 'y':posY}], [time2, {'x':posX, 'y':posY}], ...... ];
// TRACE['social210_2'] = [ [time1, {'x':posX, 'y':posY}], [time2, {'x':posX, 'y':posY}], ...... ];
// key naming: [triggerType][0-330 orientation]_[version]

const BLOCK_N = 6;
const CONDITION_N = CONDITIONS.length;
const ORIENTATIONS_N = ORIENTATIONS.length;
const ORIENTATION_PER_CONDITION_PER_BLOCK = ORIENTATIONS_N / CONDITION_N;
const INTERTRIAL_INTERVAL = 0.5;

const TEMPO_PRACTICE_MIN_TRIAL_N = 6; // 20 XXX
const TEMPO_PRACTICE_MAX_TRIAL_N = 40;
const TEMPO_PRACTICE_MAX_REMAINING_N =
    TEMPO_PRACTICE_MAX_TRIAL_N - TEMPO_PRACTICE_MIN_TRIAL_N;
const PASS_COUNT_CRITERIA = 1; // 4 XXX
const SCORE_DURATION = 0.5;
const NOTICE_DURATION = 0.7;

function CREATE_TEMPO_PRACTICE_LIST() {
    let tempo_practice_list = [];
    for (let i = 0; i < TEMPO_PRACTICE_MAX_TRIAL_N; i++) {
        tempo_practice_list.push({
            traceType: "self",
            triggerType: "static",
            orientation: ORIENTATIONS[i % ORIENTATIONS.length], // RAND_CHOICE(ORIENTATIONS),
            recycled: false
        });
    }
    return tempo_practice_list;
}

// function CREATE_PRACTICE_LIST() {
//     let practice_list = [];
//     for (const c of CONDITIONS) {
//         practice_list.push({
//             traceType: c[0],
//             triggerType: c[1],
//             orientation: PRACTICE_ORIENTATION_DICT[c[1]],
//             recycled: false
//         });
//     }
//     return SHUFFLE_ARRAY(practice_list);
// }

const PRACTICE_LIST = [
    // XXX
    {
        traceType: "other",
        triggerType: "social",
        orientation: PRACTICE_ORIENTATION_DICT["social"],
        recycled: false
    }
];

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

const TRIAL_LIST = [
    {
        traceType: "self",
        triggerType: "physical",
        orientation: 30,
        recycled: false
    },
    {
        traceType: "other",
        triggerType: "social",
        orientation: 30,
        recycled: false
    },
    {
        traceType: "self",
        triggerType: "static",
        orientation: 90,
        recycled: false
    },
    {
        traceType: "other",
        triggerType: "physical",
        orientation: 30,
        recycled: false
    },
    {
        traceType: "self",
        triggerType: "social",
        orientation: 30,
        recycled: false
    },
    {
        traceType: "other",
        triggerType: "static",
        orientation: 90,
        recycled: false
    }
]; // XXX

const TRIAL_ORIENTATION_DICT = {
    static: 90,
    physical: 30,
    social: 30
}; // XXX

const TEMPO_PRACTICE_LIST = CREATE_TEMPO_PRACTICE_LIST();
// const PRACTICE_LIST = CREATE_PRACTICE_LIST(); XXX
const PRACTICE_TRIAL_N = PRACTICE_LIST.length;
// const TRIAL_LIST = CREATE_TRIAL_LIST(); XXX
const TRIAL_N = TRIAL_LIST.length;
// const REST_TRIAL_N = TRIAL_N/BLOCK_N; XXX
const RECYCLE_COUNT_CAP = 1; // TRIAL_N/6; XXX

function CREATE_SCRIPT_LIST() {
    let scripts = [];
    for (let ori of ORIENTATIONS) {
        for (let v = 0; v < OTHER_TRACE_VERSION_N; v++) {
            scripts.push(
                `js/traces/trace_static_${("00" + ori).slice(-3)}_${v}.js`
            );
        }
    }
    // loop through TRIGGER_TYPES as well for formal experiment XXX
    return scripts;
}

const SCRIPT_LIST = CREATE_SCRIPT_LIST();

//  ######  ######## #### ##     ## ##     ## ##       ####
// ##    ##    ##     ##  ###   ### ##     ## ##        ##
// ##          ##     ##  #### #### ##     ## ##        ##
//  ######     ##     ##  ## ### ## ##     ## ##        ##
//       ##    ##     ##  ##     ## ##     ## ##        ##
// ##    ##    ##     ##  ##     ## ##     ## ##        ##
//  ######     ##    #### ##     ##  #######  ######## ####

const STIM_PATH = "media/";
const IMG_LIST = [
    "line_customized.png",
    "initial_display.jpg",
    "start_dot_display.jpg",
    "trace_display.jpg",
    "rhythm_guide.jpg"
];
const VIDEO_LIST = [
    // 'game_demo.mp4',
    // 'tempo_demo.mp4' // XXX create them
];
const SOUND_LIST = ["metronome_80bpm_181beats_centered.mp3"];
const SINEWAVE_WIDTH = 400;
const SINEWAVE_HEIGHT = 100;
const SINEWAVE_IMG_WIDTH = 400;
const SINEWAVE_IMG_HEIGHT = 400;
const PEAK_VALLEY_N = 7;
const PEAK_VALLEY_DIST = SINEWAVE_WIDTH / (PEAK_VALLEY_N - 1);
const SINEWAVE_X_SCALING = ((PEAK_VALLEY_N - 1) * Math.PI) / SINEWAVE_WIDTH;
const SINEWAVE_Y_SCALING = 2 / SINEWAVE_HEIGHT;

const CANVAS_WIDTH = 600;
const CANVAS_HEIGHT = 600;
const SINEWAVE_IMG_TOP = (CANVAS_HEIGHT - SINEWAVE_IMG_HEIGHT) / 2;
const SINEWAVE_IMG_LEFT = (CANVAS_WIDTH - SINEWAVE_IMG_WIDTH) / 2;
const X_PADDING = (CANVAS_WIDTH - SINEWAVE_WIDTH) / 2;
const Y_PADDING = (CANVAS_HEIGHT - SINEWAVE_HEIGHT) / 2;

function SINEWAVE_FUNCTION(canvas_x) {
    const X = canvas_x - X_PADDING;
    const THETA = X * SINEWAVE_X_SCALING - Math.PI;
    let y = (Math.cos(THETA) + 1) / SINEWAVE_Y_SCALING;
    if (THETA > 4 * Math.PI) {
        y = 2 / SINEWAVE_Y_SCALING;
    }
    return Y_PADDING + (SINEWAVE_HEIGHT - y);
}

const MARK_DIAMETER = 14;
const OBJECT_DIAMETER = 20;
const MARK_X = X_PADDING - MARK_DIAMETER / 2;
const MARK_Y = Y_PADDING + SINEWAVE_HEIGHT - MARK_DIAMETER / 2;
const DESTINATION_X = X_PADDING + SINEWAVE_WIDTH + OBJECT_DIAMETER / 2;
const DESTINATION_Y = Y_PADDING;
const OBJECT_INITIAL_X = DESTINATION_X - OBJECT_DIAMETER / 2;
const OBJECT_INITIAL_Y = DESTINATION_Y - OBJECT_DIAMETER / 2;

const TRACE_LINE_WIDTH = 2;
const TRACE_CAP = "round";
const TRACE_COLOR = "red";

function RESET_MARK_AND_OBJECT() {
    $("#start-mark").css({
        top: MARK_Y + "px",
        left: MARK_X + "px",
        width: MARK_DIAMETER + "px",
        height: MARK_DIAMETER + "px"
    });
    $("#end-object").css({
        top: OBJECT_INITIAL_Y + "px",
        left: OBJECT_INITIAL_X + "px",
        width: OBJECT_DIAMETER + "px",
        height: OBJECT_DIAMETER + "px"
    });
}

function SET_TASK_ELEMENT_STYLE() {
    $("#task-box").css({
        width: CANVAS_WIDTH + "px",
        height: CANVAS_HEIGHT + "px"
    });
    $("#sinewave").css({
        top: SINEWAVE_IMG_TOP + "px",
        left: SINEWAVE_IMG_LEFT + "px",
        width: SINEWAVE_IMG_WIDTH + "px",
        height: SINEWAVE_IMG_HEIGHT + "px"
    });
    RESET_MARK_AND_OBJECT();
    $("#canvas-frame").css({
        width: CANVAS_WIDTH + "px",
        height: CANVAS_HEIGHT + "px",
        "border-width": OBJECT_DIAMETER + "px"
    });
    $("#canvas").width(CANVAS_WIDTH);
    $("#canvas").height(CANVAS_HEIGHT);
}

//  ######      ###    ##     ## ########
// ##    ##    ## ##   ###   ### ##
// ##         ##   ##  #### #### ##
// ##   #### ##     ## ## ### ## ######
// ##    ##  ######### ##     ## ##
// ##    ##  ##     ## ##     ## ##
//  ######   ##     ## ##     ## ########

const BPM = 80;
const BEAT_INTERVAL = 60 / BPM;
const DEVIATION_LIMIT = PEAK_VALLEY_DIST;

const PHYSICAL_RADIUS = OBJECT_DIAMETER / 2;
const SOCIAL_RADIUS = (3 * PEAK_VALLEY_DIST) / 2;
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

var subj_options,
    instr_options,
    tempo_practice_options,
    trial_options,
    game_options;

$(document).ready(function () {
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
        textBox: $("#instr-box"),
        textElement: $("#instr-text"),
        array: MAIN_INSTRUCTIONS_ARRAY,
        restInstruction: REST_INSTRUCTION,
        quizConditions: ["onlyQ"]
    };

    tempo_practice_options = {
        titles: TEMPO_PRACTICE_TITLES,
        resetTitles: TEMPO_PRACTICE_RESET_TITLES,
        pracTrialN: 0,
        trialN: 40,
        stimPath: STIM_PATH,
        dataFile: "pre-post",
        savingScript: SAVING_SCRIPT,
        savingDir: SAVING_DIR,
        trialList: Array.from(TEMPO_PRACTICE_LIST),
        intertrialInterval: INTERTRIAL_INTERVAL,
        updateFunc: TEMPO_PRACTICE_UPDATE,
        trialFunc: TEMPO_PRACTICE_TRIAL,
        endExptFunc: END_TEMPO_PRACTICE
    };

    trial_options = {
        titles: TRIAL_TITLES,
        resetTitles: TRIAL_RESET_TITLES,
        pracTrialN: PRACTICE_TRIAL_N,
        trialN: TRIAL_N,
        // restTrialN: REST_TRIAL_N, XXX
        stimPath: STIM_PATH,
        dataFile: "pre-post",
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
        canvasElement: $("#canvas"),
        lineWidth: TRACE_LINE_WIDTH,
        lineCap: TRACE_CAP,
        lineColor: TRACE_COLOR,
        frozenLineColor: "gray",
        sinewave: $("#sinewave"),
        peakValleyN: PEAK_VALLEY_N,
        sinewaveWaveWidth: SINEWAVE_WIDTH,
        mark: $("#start-mark"),
        object: $("#end-object"),
        objectSpeed: OBJECT_SPEED,
        destinationX: DESTINATION_X,
        destinationY: DESTINATION_Y,
        destinationDist: PHYSICAL_RADIUS,
        soundElement: $("#metronome")[0],
        triggerDistDict: TRIGGER_DIST_DICT,
        bpm: BPM,
        deviationLimit: DEVIATION_LIMIT,
        recognitionQElement: $("#recognition-q"),
        interruptCallback: INTERRUPT
    };

    RUN_STUDY();
});
