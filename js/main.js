// Yi-Chia Chen
var instr, subj, tempo_practice, trial, game;

function RUN_STUDY() {
    if (DETECT_METHOD("fromEntries", Object)) {
        LOAD_IMG(0, STIM_PATH, IMG_LIST);
        subj = new subjObject(subj_options);
        subj.id = subj.getID(ID_GET_VARIABLE_NAME);
        subj.recycledCount = 0;
        subj.recycleReachedMax = false;
        tempo_practice_options["subj"] = subj;
        tempo_practice_options["dataFile"] =
            subj.id + "_" + TEMPO_PRACTICE_FILE;
        trial_options["subj"] = subj;
        trial_options["dataFile"] = subj.id + "_" + TRIAL_FILE;
        subj.saveVisit();
        if (subj.phone) {
            HALT_EXPERIMENT(
                "It seems that you are using a touchscreen device or a phone. Please use a laptop or desktop instead.<br /><br />" +
                    "If you believe you have received this message in error, please contact the experimenter at akadambi@ucla.edu<br /><br />" +
                    "Otherwise, please switch to a laptop or a desktop computer for this experiment."
            );
        } else if (subj.valid_id) {
            INSTRUCTION_START();
        } else {
            HALT_EXPERIMENT(
                "We can't identify a valid ID. Please reopen the study from the sona website again. Thank you!"
            );
        }
    } else {
        HALT_EXPERIMENT(
            "Your browser does not support part of this study, please update your browser and restart the study from SONA."
        );
    }
}

function HALT_EXPERIMENT(explanation) {
    $(".page-box").hide();
    $("#instr-text").html(explanation);
    $("#next-button").hide();
    $("#instr-box").show();
}

//  ######  ##     ## ########        ## ########  ######  ########
// ##    ## ##     ## ##     ##       ## ##       ##    ##    ##
// ##       ##     ## ##     ##       ## ##       ##          ##
//  ######  ##     ## ########        ## ######   ##          ##
//       ## ##     ## ##     ## ##    ## ##       ##          ##
// ##    ## ##     ## ##     ## ##    ## ##       ##    ##    ##
//  ######   #######  ########   ######  ########  ######     ##

const SUBJ_TITLES = [
    "num",
    "date",
    "startTime",
    "id",
    "userAgent",
    "endTime",
    "duration",
    "instrReadingTimes",
    "quickReadingPageN",
    "hiddenCount",
    "hiddenDurations",
    "tempoPracticeCount",
    "recycledCount",
    "recycleReachedMax",
    "device",
    "otherDevice",
    "monitor",
    "fullscreen",
    "serious",
    "problems",
    "gender",
    "age",
    "manipulationCheckAlive",
    "manipulationCheckSocial",
    "inView",
    "viewportW",
    "viewportH"
];

function SUBJ_NUM_CALLBACK() {
    if (typeof trial !== "undefined") {
        tempo_practice.num = subj.num;
        trial.num = subj.num;
    }
}

function HANDLE_VISIBILITY_CHANGE() {
    if (document.hidden) {
        subj.hiddenCount += 1;
        subj.hiddenStartTime = Date.now();
    } else {
        subj.hiddenDurations.push((Date.now() - subj.hiddenStartTime) / 1000);
    }
}

function TOGGLE_OTHER_DEVICE_QUESTION() {
    if ($('input[name="device"]:checked').val() == "other") {
        $("#other-device-question").show();
    } else {
        $("#other-device-question").hide();
    }
}

function SHOW_DEBRIEFING_QUESTIONS() {
    $("body").css("overflow-y", "auto");
    $('input:radio[name="device"]').change(TOGGLE_OTHER_DEVICE_QUESTION);
    $("#debriefing-q-button").on("click", SUBMIT_DEBRIEFING_Q);
    $("#questions-box").show();
}

function SUBMIT_DEBRIEFING_Q() {
    let choice_dict = {
        device: $('input[name="device"]:checked').val(),
        monitor: $('input[name="monitor"]:checked').val(),
        fullscreen: $('input[name="fullscreen"]:checked').val(),
        serious: $('input[name="serious"]:checked').val(),
        gender: $('input[name="gender"]:checked').val()
    };
    let open_ended_dict = {
        problems: $("#problems").val(),
        age: $("#age").val()
    };
    if (choice_dict.device == "other") {
        open_ended_dict.otherDevice = $("#other-device").val();
    }
    open_ended_dict = APPLY_FUNCTION_TO_OBJ(
        open_ended_dict,
        REPLACE_LINE_BREAK_IN_ENTRY_VALUE
    );
    if (
        CHECK_IF_ALL_OBJECT_KEYS_HAVE_DEFINED_VALUE(
            open_ended_dict,
            choice_dict
        )
    ) {
        $("#questions-box").hide();
        open_ended_dict = Object.fromEntries(open_ended_dict);
        Object.assign(subj, choice_dict, open_ended_dict);
        SHOW_MANIPULATION_CHECK_INSTRUCTIONS();
    } else {
        $("#q-warning").text(
            "Please answer all questions to continue. Thank you!"
        );
    }
}

function SHOW_MANIPULATION_CHECK_INSTRUCTIONS() {
    $("#next-button").show();
    instr.next();
}

function SHOW_DEBRIEFING() {
    ALLOW_SELECTION();
    subj.exitFullscreen();
    $("#debriefing-box").show();
    $("html")[0].scrollIntoView();
    $("#end-button").on("click", END_TO_SONA);
    subj.save();
}

function END_TO_SONA() {
    window.location.href = COMPLETION_URL + subj.id;
}

function ALLOW_SELECTION() {
    $("body").css({
        "-webkit-user-select": "text",
        "-moz-user-select": "text",
        "-ms-user-select": "text",
        "user-select": "text"
    });
}

// #### ##    ##  ######  ######## ########
//  ##  ###   ## ##    ##    ##    ##     ##
//  ##  ####  ## ##          ##    ##     ##
//  ##  ## ## ##  ######     ##    ########
//  ##  ##  ####       ##    ##    ##   ##
//  ##  ##   ### ##    ##    ##    ##    ##
// #### ##    ##  ######     ##    ##     ##

function INSTRUCTION_START() {
    instr = new instrObject(instr_options);
    tempo_practice = new trialObject(tempo_practice_options);
    trial = new trialObject(trial_options);
    $("#next-button").on("click", () => {
        instr.next();
    });
    instr.start();
    LOAD_SCRIPT(0, SCRIPT_LIST);
}

// prettier-ignore
const MAIN_INSTRUCTIONS_ARRAY = [
    [SHOW_CONSENT,false,'Thank you very much!<br /><br />This study will take about 30 minutes. Please read the instructions carefully, and avoid using the refresh or back buttons.'],
    [HIDE_CONSENT,false,"We will need to play sounds during the study, so please turn on your speakers or put on your headphones now.<br /><br />If you don't have a sound device, " + 'please contact the experimenter at akadambi@ucla.edu with the phrase "NO-SOUND-DEVICE".'],
    [SHOW_SOUND_TEST,false,"Now, please play the calibration sound to adjust the volume. Make sure you can clearly and comfortably hear the sound. Press SPACE when you are done."],
    [false,false,"For this study to work, the webpage will automatically switch to the full-screen view on the next page. Please stay in the full screen mode until the study automatically switches out from it."],
    [SWITCH_TO_FULL_SCREEN,false,"In this study, you will be playing a game."],
    [false,false,"Before I explain the details of how to play the game, let me just quickly show you what the game looks like when I play it."],
    [false, SHOW_GAME_DEMO, ""],
    [SHOW_INITIAL_DISPLAY,false,"Now onto the explanations:<br />You will be playing this game multiple times. Each game started with a blue path in the center (see the image below). There is a white dot in the beginning of the path, and a yellow dot at the end of the path."],
    [SHOW_ARROW_TO_START_DOT,false,"To start each game, you will need to click on the white dot with your cursor to start. After that, your cursor will be replaced by a red dot."],
    [SHOW_TRACE_DISPLAY,false,"Once the game starts, you will move your mouse to control the red dot.<br /><br />You will *NOT* need to press down any mouse buttons during this! (So just move your mouse, not pressing down and dragging it.)"],
    [HIDE_INSTR_IMG,false,"Your job is to trace the blue path with the red dot, as closely as possible.<br /><br />Try it once on the next page! (Note that a sound will be played while you are tracing the path, but you can ignore it for now.)"],
    [false, RUN_TRACING_PRACTICE, ""],
    [HIDE_ALL_BOXES,SHOW_AGAIN_BUTTON_FOR_TRACING_PRACTICE,"Got it?<br />Hit AGAIN if you'd like to give it another try.<br />Otherwise, hit NEXT."],
    [HIDE_AGAIN_BUTTON,false,"Let's talk about the sound: The clicking sound in the background serves to guide the speed of your cursor movements during the game."],
    [SHOW_RHYTHM_GUIDE,false,"Try your best to control your cursor's speed this way:<br />Reach the peak or valley of the wave at each click. (See the image below.)<br /><br />You will see an example on the next page."],
    [HIDE_INSTR_IMG, SHOW_TEMPO_DEMO, ""],
    [false,false,"Note that on the first click, you should *STAY* at the starting position, and aim to reach the first peak of the wave only at the second click."],
    [false,SHOW_AGAIN_BUTTON_FOR_TEMPO_DEMO,"Does this make sense?<br />You can watch the example again by clicking AGAIN.<br />Otherwise, click NEXT to try it once yourself!"],
    [HIDE_AGAIN_BUTTON, RUN_TRACING_PRACTICE, ""],
    [HIDE_ALL_BOXES,false,"As you may have noticed, it is not exactly easy on the first try. Since it is VERY important that you trace the path in the specified speed as accurately as possible, you will practice this a few times before we continue the explanation for the game."],
    [BIND_TEMPO_PRACTICE_BLOCK,false,"During the practice, you will see a score after each try, which indicates how much your trace deviates from the path and the tempo. Your goal is to complete 20 practice games and reach above 60% 4 times in a row after. Of course, I will be glad if you aim at 100%!<br /><br />Hit SPACE to start!"],
    [false,false,"You've passed! Good job!<br /><br />Now that you are doing so well, in the actual game, I'll add a hard limit on how much you can deviate from the ideal path and speed:<br />The game will be interrupted by a warning if you stray too far, and you will have to repeat that particular game later. So keep up the good work!"],
    [false,false,"In the actual game, there will be a yellow dot at the end of the path, which moves during the games. In each game, it may stay static, appear to be pushed away, or move away on its own to avoid contact with the red dot. Whichever happens, your job is to remain calm and carry on."],
    [false,false,"Now here's one last trick for the formal games: Sometimes, the red dot will *NOT* be following your cursor movements, but moving along a path from a prerecorded game of others."],
    [false,false,"So after each game, you will be asked to guess whether the red dot was following your cursor movements or a prerecorded path, by pressing Y for yours, and N for not yours.<br /><br />Try it once on the next page!"],
    [false, RUN_FULL_PRACTICE, ""],
    [HIDE_ALL_BOXES,SHOW_AGAIN_BUTTON_FOR_FULL_PRACTICE,"That was a prerecorded path. Can you tell?<br /><br />You can look at it again by clicking AGAIN, or move on by clicking NEXT."],
    [HIDE_AGAIN_BUTTON,false,"Sometimes, you may be relatively confident that the red dot is following your cursor movements or a prerecorded path, sometimes you may not. Either way is completely fine. Just make your best guess."],
    [false,false,"While there are various strategies you can use to test if the red dot is following your cursor movements (e.g., pausing your movements sometimes to see if the dot pauses as well), please try your best to *NOT* use them intentionally.<br /><br />Just focus on tracing the path at the designated speed. Otherwise, you will likely incur trace deviations and fail the games."]
    [false,false,"Okay, now, a quick review:<br />(1) Click on the white dot to start.<br />(2) Trace the blue path following the tempo of the click sound.<br />(3) Make your best guess whether the red dot is following your cursor movements or not."],
    [BIND_START_EXPERIMENT,false,"That's it!<br /><br />Now you may start the formal games by press SPACE!"],
    [false,false,"You are almost done! I need you to play 2 last games with a small change."],
    [false,false,"This time, I won't be asking you whether the red dot is following your cursor movements or not. It will always follow your cursor."],
    [BIND_MANIPULATION_CHECK,false,"Instead, please pay attention to your overall impressions of the displays throughout these 2 games. I will ask you 2 quick questions after.<br /><br />Press SPACE to start!"],
    [BIND_MANIPULATION_CHECK_QUESTIONS,false,"In these 2 games you just played, the yellow dot at the end of the path moved in different ways and that sometimes gives rise to different impressions.<br /><br />Even though you clearly know that it was just a yellow dot on the screen, sometimes you may still have an impression that it appears to be alive or acting socially.<br /><br />On the next page, I am going to ask you two questions about those impressions."]
];

const REST_INSTRUCTION =
    "You are done with ##% of the study!<br /><br />Take a short break now and hit space to continue whenever you are ready.";

function SHOW_CONSENT() {
    $("#consent-box").show();
}

function HIDE_CONSENT() {
    $("#consent-box").hide();
    $("#instr-box").addClass("fixed-box");
}

function SHOW_INSTR_IMG(file_name) {
    $("#instr-img").attr("src", STIM_PATH + file_name);
    $("#instr-img").css("display", "block");
}

function HIDE_INSTR_IMG() {
    $("#instr-img").css("display", "none");
}

function SHOW_INITIAL_DISPLAY() {
    SHOW_INSTR_IMG("initial_display.jpg");
}

function SHOW_ARROW_TO_START_DOT() {
    SHOW_INSTR_IMG("start_dot_display.jpg");
}

function SHOW_TRACE_DISPLAY() {
    SHOW_INSTR_IMG("trace_display.jpg");
}

function SHOW_RHYTHM_GUIDE() {
    SHOW_INSTR_IMG("rhythm_guide.jpg");
}

function SWITCH_TO_FULL_SCREEN() {
    $("#instr-img").css("display", "none");
    subj.launchFullscreen();
}

function SHOW_SOUND_TEST() {
    BIND_SPACE_PRESS_EVENT_LISTENER(END_SOUND_TEST);
    $("#sound-test-play-button").css("display", "block");
    $("#sound-test-play-button").on("click", () => {
        $("#sound-test-aud")[0].play();
    });
}

function END_SOUND_TEST() {
    $("#sound-test-aud")[0].pause();
    $("#sound-test-play-button").hide();
    $("#sound-test-play-button").off("click");
    $("#next-button").css("display", "block");
    instr.next();
}

function SHOW_DEMO(id) {
    $("#instr-text").hide();
    $("#next-button").hide();
    let video_obj = $("#" + id);
    video_obj.css("display", "block");
    video_obj[0].play();
    video_obj.on("ended", function () {
        video_obj.off("ended");
        video_obj.hide();
        $("#next-button").css("display", "block");
        instr.next();
    });
}

function SHOW_GAME_DEMO() {
    SHOW_DEMO("game-demo-vid");
}

function SHOW_TEMPO_DEMO() {
    SHOW_DEMO("tempo-demo-vid");
}

function SHOW_AGAIN_BUTTON(func) {
    function SHOW_AGAIN() {
        $("#again-button").off("click");
        instr.index -= 1;
        func();
    }
    $("#again-button").off("click");
    $("#again-button").on("click", SHOW_AGAIN);
    $("#again-button").css("display", "block");
}

function HIDE_AGAIN_BUTTON() {
    $("#again-button").off("click");
    $("#again-button").hide();
}

function SHOW_AGAIN_BUTTON_FOR_TRACING_PRACTICE() {
    SHOW_AGAIN_BUTTON(RUN_TRACING_PRACTICE);
}

function SHOW_AGAIN_BUTTON_FOR_TEMPO_DEMO() {
    SHOW_AGAIN_BUTTON(SHOW_TEMPO_DEMO);
}

function SHOW_AGAIN_BUTTON_FOR_FULL_PRACTICE() {
    SHOW_AGAIN_BUTTON(RUN_FULL_PRACTICE);
}

function RUN_TRACING_PRACTICE() {
    instr.saveReadingTime();
    $("#instr-box").hide();
    RESET_MARK_AND_OBJECT();
    $("#task-box").show();
    game_options["tempo_practice"] = true;
    game_options["gameEndCallback"] = () => {
        instr.next();
    };
    game = new gameObject(game_options);
    game.canvasOffsetLeft = game.canvasElement.offset().left;
    game.canvasOffsetTop = game.canvasElement.offset().top;

    let this_game = {
        triggerType: "static",
        traceType: "self",
        orientation: 0,
        otherTrajectory: false
    };
    game.update(this_game, false);

    const START_TIME = Date.now();
    $("#start-mark").click(function () {
        $("#start-mark").off("click");
        game.start(START_TIME);
    });
}

function RUN_FULL_PRACTICE() {
    instr.saveReadingTime();
    $("#instr-box").hide();
    RESET_MARK_AND_OBJECT();
    $("#task-box").show();
    game_options["tempo_practice"] = false;
    game_options["gameEndCallback"] = () => {
        instr.next();
    };
    game = new gameObject(game_options);
    game.canvasOffsetLeft = game.canvasElement.offset().left;
    game.canvasOffsetTop = game.canvasElement.offset().top;

    let this_game = {
        triggerType: "static",
        traceType: "other",
        orientation: 0,
        otherTrajectory: TRACE_DICT["static90_0"].slice()
    };
    game.update(this_game, true);

    const START_TIME = Date.now();
    $("#start-mark").click(function () {
        $("#start-mark").off("click");
        game.start(START_TIME);
    });
}

function RUN_MANIPULATION_CHECK_1() {
    RESET_MARK_AND_OBJECT();
    $("#task-box").show();
    game_options["tempo_practice"] = true;
    game_options["gameEndCallback"] = RUN_MANIPULATION_CHECK_2;
    game = new gameObject(game_options);
    game.canvasOffsetLeft = game.canvasElement.offset().left;
    game.canvasOffsetTop = game.canvasElement.offset().top;

    let this_game = {
        triggerType: "physical",
        traceType: "self",
        orientation: 0,
        otherTrajectory: false
    };
    game.update(this_game, true);

    const START_TIME = Date.now();
    $("#start-mark").click(function () {
        $("#start-mark").off("click");
        game.start(START_TIME);
    });
}

function RUN_MANIPULATION_CHECK_2() {
    RESET_MARK_AND_OBJECT();
    game_options["tempo_practice"] = true;
    game_options["gameEndCallback"] =
        GO_BACK_TO_MANIPULATION_CHECK_INSTRUCTIONS;
    game = new gameObject(game_options);
    game.canvasOffsetLeft = game.canvasElement.offset().left;
    game.canvasOffsetTop = game.canvasElement.offset().top;

    let this_game = {
        triggerType: "social",
        traceType: "self",
        orientation: 0,
        otherTrajectory: false
    };
    game.update(this_game, true);

    const START_TIME = Date.now();
    $("#start-mark").click(function () {
        $("#start-mark").off("click");
        game.start(START_TIME);
    });
}

function GO_BACK_TO_MANIPULATION_CHECK_INSTRUCTIONS() {
    $("#task-box").hide();
    $("#next-button").show();
    instr.next();
}

function HIDE_ALL_BOXES() {
    $(".page-box").hide();
}

function BIND_SPACE_PRESS_EVENT_LISTENER(func) {
    $("#next-button").hide();
    $(document).keyup(function (e) {
        if (e.code == "Space") {
            $(document).off("keyup");
            instr.saveReadingTime();
            $("#instr-box").hide();
            func();
        }
    });
}

function BIND_TEMPO_PRACTICE_BLOCK() {
    BIND_SPACE_PRESS_EVENT_LISTENER(RUN_TEMPO_BLOCK);
}

function BIND_START_EXPERIMENT() {
    BIND_SPACE_PRESS_EVENT_LISTENER(RUN_TASK);
}

function BIND_MANIPULATION_CHECK() {
    BIND_SPACE_PRESS_EVENT_LISTENER(RUN_MANIPULATION_CHECK_1);
}

function BIND_MANIPULATION_CHECK_QUESTIONS() {
    $("#next-button").off("click");
    $("#next-button").on("click", SHOW_MANIPULATION_CHECK_QUESTIONS);
}

function SHOW_MANIPULATION_CHECK_QUESTIONS() {
    instr.saveReadingTime();
    $("#instr-box").hide();
    $("#manipulation-check-q-box").show();
    $("#manipulation-check-q-button").on(
        "click",
        SUBMIT_MANIPULATION_CHECK_QUESTIONS
    );
}

function SUBMIT_MANIPULATION_CHECK_QUESTIONS() {
    let choice_dict = {
        manipulationCheckAlive: $(
            'input[name="manipulationCheckAlive"]:checked'
        ).val(),
        manipulationCheckSocial: $(
            'input[name="manipulationCheckSocial"]:checked'
        ).val()
    };
    if (CHECK_IF_ALL_OBJECT_KEYS_HAVE_DEFINED_VALUE({}, choice_dict)) {
        $("#manipulation-check-q-box").hide();
        Object.assign(subj, choice_dict);
        subj.instrReadingTimes = JSON.stringify(instr.readingTimes);
        subj.quickReadingPageN = Object.values(instr.readingTimes).filter(
            (d) => d < INSTR_READING_TIME_MIN
        ).length;
        SHOW_DEBRIEFING();
    } else {
        $("#manipulation-check-q-warning").text(
            "Please answer all questions to continue. Thank you!"
        );
    }
}

// ######## ########  ####    ###    ##
//    ##    ##     ##  ##    ## ##   ##
//    ##    ##     ##  ##   ##   ##  ##
//    ##    ########   ##  ##     ## ##
//    ##    ##   ##    ##  ######### ##
//    ##    ##    ##   ##  ##     ## ##
//    ##    ##     ## #### ##     ## ########

const TEMPO_PRACTICE_TITLES = [
    "num",
    "date",
    "subjStartTime",
    "trialNum",
    "orientation",
    "selfTrace",
    "startDeviationX",
    "startDeviationY",
    "endDeviationX",
    "endDeviationY",
    "maxDeviationX",
    "maxDeviationY",
    "score",
    "passCount",
    "startDelay",
    "traceDuration",
    "startToTriggerDuration",
    "inView",
    "inFullScreen"
];

const TEMPO_PRACTICE_RESET_TITLES = [
    "orientation",
    "selfTrace",
    "startDeviationX",
    "startDeviationY",
    "endDeviationX",
    "endDeviationY",
    "maxDeviationX",
    "maxDeviationY",
    "score",
    "startDelay",
    "traceDuration",
    "startToTriggerDuration",
    "inView",
    "inFullScreen"
];

const TRIAL_TITLES = [
    "num",
    "date",
    "subjStartTime",
    "blockNum",
    "restCount",
    "trialNum",
    "triggerType",
    "traceType",
    "traceNum",
    "traceVersion",
    "orientation",
    "selfTrace",
    "recycled",
    "interrupted",
    "startDeviationX",
    "startDeviationY",
    "endDeviationX",
    "endDeviationY",
    "maxDeviationX",
    "maxDeviationY",
    "recognition",
    "startDelay",
    "traceDuration",
    "startToTriggerDuration",
    "objectMoveDuration",
    "startToObjectEndRT",
    "recognitionRT",
    "inView",
    "inFullScreen"
];

const TRIAL_RESET_TITLES = [
    "triggerType",
    "traceType",
    "traceNum",
    "traceVersion",
    "orientation",
    "selfTrace",
    "recycled",
    "interrupted",
    "startDeviationX",
    "startDeviationY",
    "endDeviationX",
    "endDeviationY",
    "maxDeviationX",
    "maxDeviationY",
    "recognition",
    "startDelay",
    "traceDuration",
    "startToTriggerDuration",
    "objectMoveDuration",
    "startToObjectEndRT",
    "recognitionRT",
    "inView",
    "inFullScreen"
];

function RUN_TEMPO_BLOCK() {
    $("#task-box").show();
    tempo_practice.passCount = 0;
    game_options["tempo_practice"] = true;
    game_options["gameEndCallback"] = GAME_END;
    game = new gameObject(game_options);
    game.canvasOffsetLeft = game.canvasElement.offset().left;
    game.canvasOffsetTop = game.canvasElement.offset().top;
    tempo_practice.run();
}

function RUN_TASK() {
    $("#task-box").show();
    subj.saveAttrition();
    game_options["tempo_practice"] = false;
    game_options["gameEndCallback"] = GAME_END;
    game = new gameObject(game_options);
    game.canvasOffsetLeft = game.canvasElement.offset().left;
    game.canvasOffsetTop = game.canvasElement.offset().top;
    trial.run();
}

function TEMPO_PRACTICE_UPDATE(
    formal_trial,
    last,
    this_trial,
    next_trial,
    path
) {
    TRAIL_UPDATE_BASED_ON_BLOCK_TYPE(tempo_practice, this_trial);
    game.update(tempo_practice.thisGame, false);
}

function TRIAL_UPDATE(formal_trial, last, this_trial, next_trial, path) {
    TRAIL_UPDATE_BASED_ON_BLOCK_TYPE(trial, this_trial);
    game.update(trial.thisGame, true);
}

function TRAIL_UPDATE_BASED_ON_BLOCK_TYPE(trial_obj, this_trial) {
    trial_obj.clearLastTrialData(false);
    trial_obj.triggerType = this_trial["triggerType"];
    trial_obj.traceType = this_trial["traceType"];
    trial_obj.orientation = this_trial["orientation"];
    trial_obj.recycled = this_trial["recycled"];
    let otherTrace = false;
    if (trial_obj.traceType == "other") {
        trial_obj.traceVersion = RAND_CHOICE([0, 1, 2]);
        trial_obj.traceNum = `static${trial_obj.orientation}_${trial_obj.traceVersion}`;
        // `${trial_obj.triggerType}${trial_obj.orientation}_${trial_obj.otherTraceVersion}` // for formal XXX
        otherTrace = TRACE_DICT[trial_obj.traceNum].slice();
    }
    trial_obj.thisGame = {
        triggerType: this_trial["triggerType"],
        traceType: this_trial["traceType"],
        orientation: this_trial["orientation"],
        otherTrajectory: otherTrace
    };
}

function TEMPO_PRACTICE_TRIAL() {
    START_TRIAL(tempo_practice);
}

function TRIAL() {
    START_TRIAL(trial);
}

function START_TRIAL(trial_obj) {
    trial_obj.inView = CHECK_FULLY_IN_VIEW($("#task-box"));
    trial_obj.inFullScreen = CHECK_IF_FULLSCREEN();
    const START_TIME = Date.now();
    $("#start-mark").click(function () {
        $("#start-mark").off("click");
        game.start(START_TIME);
    });
}

function INTERRUPT() {
    $("body").css("cursor", "default");
    $("#interruption-notice").show();
    setTimeout(function () {
        $("#interruption-notice").hide();
        trial.interrupted = true;
        if (trial.trialNum > 0 && subj.recycledCount < RECYCLE_COUNT_CAP) {
            trial.trialList.push({
                triggerType: trial.triggerType,
                traceType: trial.traceType,
                orientation: trial.orientation,
                recycled: true
            });
            subj.recycledCount += 1;
        } else if (subj.recycledCount >= RECYCLE_COUNT_CAP) {
            subj.recycleReachedMax = true;
        }
        RECORD_TRIAL_DATA(trial);
        trial.runRestOrEnd(
            $("#task-box"),
            $("#rest-box"),
            $("#rest-text"),
            REST_INSTRUCTION
        );
    }, NOTICE_DURATION * 1000);
}

function GAME_END() {
    $("body").css("cursor", "default");
    if (game.tempo_practice) {
        tempo_practice.score = CALCULATE_TEMPO_SCORE();
        UPDATE_PASS_COUNT(tempo_practice.score);
        RECORD_TRIAL_DATA(tempo_practice);
        SHOW_SCORE();
    } else {
        RECORD_TRIAL_DATA(trial);
        trial.runRestOrEnd(
            $("#task-box"),
            $("#rest-box"),
            $("#rest-text"),
            REST_INSTRUCTION
        );
    }
}

function RECORD_TRIAL_DATA(trial_obj) {
    trial_obj.startDelay = game.startDelay;
    trial_obj.traceDuration = game.traceRT;
    trial_obj.startToObjectEndRT = game.startToObjectEndRT;

    let self_trace = "[";
    for (let x of game.selfTrajectory) {
        self_trace = self_trace + "{";
        for (const [key, value] of Object.entries(x)) {
            self_trace = self_trace + `"${key}": ${value},`;
        }
        self_trace = self_trace + "},";
    }
    self_trace = self_trace + "]";

    trial_obj.selfTrace = self_trace;
    trial_obj.startDeviationX = game.startDeviationX;
    trial_obj.startDeviationY = game.startDeviationY;
    trial_obj.endDeviationX = game.endDeviationX;
    trial_obj.endDeviationY = game.endDeviationY;
    trial_obj.maxDeviationX = game.maxDeviationX;
    trial_obj.maxDeviationY = game.maxDeviationY;
    trial_obj.startToTriggerDuration = game.startToTriggerDuration;
    trial_obj.objectMoveDuration = game.objectMoveDuration;
    trial_obj.recognition = game.recognition;
    trial_obj.recognitionRT = game.recognitionRT;
    if (trial_obj.trialNum > 0) {
        const DATA_LIST = LIST_FROM_ATTRIBUTE_NAMES(
            trial_obj,
            trial_obj.titles
        );
        trial_obj.allData += LIST_TO_FORMATTED_STRING(DATA_LIST);
    }
}

function SHOW_SCORE() {
    let display_score = Math.floor(tempo_practice.score);
    $("#practice-score").text(display_score.toString() + "%");
    if (tempo_practice.score >= 60) {
        $("#practice-score").css("color", "#7ce7c7");
    } else {
        $("#practice-score").css("color", "#e77c7c");
    }
    $("#practice-score").show();
    setTimeout(TEMPO_PRACTICE_RUN_OR_END, SCORE_DURATION * 1000);
}

function CALCULATE_TEMPO_SCORE() {
    let x_score =
        Math.max(0, 1 - (2 * game.maxDeviationX) / (5 * DEVIATION_LIMIT)) * 100;
    let y_score =
        Math.max(0, 1 - (2 * game.maxDeviationY) / (5 * DEVIATION_LIMIT)) * 100;
    return Math.min(x_score, y_score);
}

function UPDATE_PASS_COUNT(score) {
    if (score > 60) {
        tempo_practice.passCount += 1;
    } else {
        tempo_practice.passCount = 0;
    }
}

function TEMPO_PRACTICE_RUN_OR_END() {
    $("#practice-score").hide();
    if (CHECK_TEMPO_PRACTICE_END()) {
        tempo_practice.complete = true;
        subj.tempoPracticeCount =
            TEMPO_PRACTICE_MAX_TRIAL_N - tempo_practice.remainingTrialN;
        tempo_practice.endExptFunc();
    } else {
        tempo_practice.run();
    }
}

function CHECK_TEMPO_PRACTICE_END() {
    tempo_practice.remainingTrialN = tempo_practice.trialList.length;
    if (tempo_practice.remainingTrialN == 0) return true;
    else if (
        tempo_practice.passCount >= PASS_COUNT_CRITERIA &&
        tempo_practice.remainingTrialN <= TEMPO_PRACTICE_MAX_REMAINING_N
    )
        return true;
    else return false;
}

function END_TEMPO_PRACTICE() {
    $("#task-box").hide();
    $("#next-button").css("display", "block");
    tempo_practice.save();
    instr.next();
}

function END_TASK() {
    $("#task-box").hide();
    trial.save();
    SHOW_DEBRIEFING_QUESTIONS();
}
