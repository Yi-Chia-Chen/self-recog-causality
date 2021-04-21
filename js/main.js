// Yi-Chia Chen
var instr, subj, trial, game;

function RUN_STUDY() {
    if (DETECT_METHOD('fromEntries', Object)) {
        LOAD_IMG(0, STIM_PATH, IMG_LIST, function() {});
        subj = new subjObject(subj_options);
        // subj.id = subj.getID(ID_GET_VARIABLE_NAME); XXX
        // subj.visitFile = subj.id + '_' + VISIT_FILE; XXX
        // subj.attritionFile = subj.id + '_' + ATTRITION_FILE; XXX
        // subj.subjFile = subj.id + '_' + SUBJ_FILE; XXX
        subj.recycledCount = 0;
        subj.recycleReachedMax = false;
        trial_options['subj'] = subj;
        // trial_options['dataFile'] = subj.id + '_' + TRIAL_FILE; XXX
        // subj.saveVisit(); XXX
        // if (subj.phone) {
        //     HALT_EXPERIMENT('It seems that you are using a touchscreen device or a phone. Please use a laptop or desktop instead.<br /><br />If you believe you have received this message in error, please contact the experimenter at akadambi@ucla.edu<br /><br />Otherwise, please switch to a laptop or a desktop computer for this experiment.');
        // } else if (subj.valid_id){ XXX
            INSTRUCTION_START();
        // } else{
        //     HALT_EXPERIMENT("We can't identify a valid ID. Please reopen the study from the sona website again. Thank you!");
        // } XXX
    } else {
        HALT_EXPERIMENT('Your browser does not support part of this study, please update your broswer and restart the study from SONA.');
    }
}

function HALT_EXPERIMENT(explanation) {
    $('.page-box').hide();
    $('#instr-text').html(explanation);
    $('#next-button').hide();
    $('#instr-box').show();
}

//  ######  ##     ## ########        ## ########  ######  ########
// ##    ## ##     ## ##     ##       ## ##       ##    ##    ##
// ##       ##     ## ##     ##       ## ##       ##          ##
//  ######  ##     ## ########        ## ######   ##          ##
//       ## ##     ## ##     ## ##    ## ##       ##          ##
// ##    ## ##     ## ##     ## ##    ## ##       ##    ##    ##
//  ######   #######  ########   ######  ########  ######     ##

const SUBJ_TITLES = [
    'num',
    'date',
    'startTime',
    'id',
    'userAgent',
    'endTime',
    'duration',
    'instrQuizAttemptN',
    'instrReadingTimes',
    'quickReadingPageN',
    'hiddenCount',
    'hiddenDurations',
    'recycledCount',
    'recycleReachedMax',
    'device',
    'otherDevice',
    'serious',
    'problems',
    'gender',
    'age',
    'manipulationCheckPhysical',
    'manipulationCheckSocial',
    'inView',
    'viewportW',
    'viewportH'
];

function SUBJ_NUM_CALLBACK() {
    if (typeof trial !== 'undefined'){
        trial.num = subj.num;
    }
}

function HANDLE_VISIBILITY_CHANGE() {
    if (document.hidden) {
        subj.hiddenCount += 1;
        subj.hiddenStartTime = Date.now();
    } else  {
        subj.hiddenDurations.push((Date.now() - subj.hiddenStartTime)/1000);
    }
}

function TOGGLE_OTHER_DEVICE_QUESTION() {
    if ($('input[name="device"]:checked').val() == 'other') {
        $('#other-device-question').show();
    }
    else {
        $('#other-device-question').hide();
    }
}

function SHOW_DEBRIEFING_QUESTIONS() {
    $('body').css('overflow-y', 'auto');
    $('input:radio[name="device"]').change(TOGGLE_OTHER_DEVICE_QUESTION);
    $('#debriefing-q-button').on('click', SUBMIT_DEBRIEFING_Q);
    $('#questions-box').show();
}

function SUBMIT_DEBRIEFING_Q() {
    let choice_dict = {
        device: $('input[name="device"]:checked').val(),
        serious: $('input[name="serious"]:checked').val(),
        gender: $('input[name="gender"]:checked').val()
    };
    let open_ended_dict = {purpose: $('#purpose').val(), problems: $('#problems').val(), age: $('#age').val()};
    if (choice_dict.device == 'other') {
        open_ended_dict.otherDevice = $('#other-device').val();
    }
    open_ended_dict = APPLY_FUNCTION_TO_OBJ(open_ended_dict, REPLACE_LINE_BREAK_IN_ENTRY_VALUE);
    if (CHECK_IF_ALL_OBJECT_KEYS_HAVE_DEFINED_VALUE(open_ended_dict, choice_dict)) {
        $('#questions-box').hide();
        SHOW_MANIPULATION_CHECK_INSTRUCTIONS();
        Object.assign(subj, choice_dict, open_ended_dict);
        subj.instrQuizAttemptN = instr.quizAttemptN['onlyQ'];
    } else {
        $('#q-warning').text('Please answer all questions to continue. Thank you!');
    }
}

function SHOW_MANIPULATION_CHECK_INSTRUCTIONS() {
    $('#next-button').show();
    instr.next();
}

function SHOW_DEBRIEFING() {
    ALLOW_SELECTION();
    subj.exitFullscreen();
    $('#debriefing-box').show();
    $('html')[0].scrollIntoView();
    subj.save();
}

function END_TO_SONA() {
    window.location.href = COMPLETION_URL+subj.id;
}

function ALLOW_SELECTION() {
    $('body').css({
        '-webkit-user-select':'text',
        '-moz-user-select':'text',
        '-ms-user-select':'text',
        'user-select':'text'
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
    trial = new trialObject(trial_options);
    instr = new instrObject(instr_options);
    // $('#next-button').on('click', instr.next()); XXX
    // instr.start(); XXX
    RUN_TASK(); // XXX
}

const MAIN_INSTRUCTIONS_ARRAY = [
    [SHOW_CONSENT, false, 'Thank you very much!<br /><br />This study will take about 30 minutes. Please read the instructions carefully, and avoid using the refresh or back buttons.'],
    [HIDE_CONSENT, false, "For this study to work, the webpage will automatically switch to the full-screen view on the next page."],
    [SWITCH_TO_FULL_SCREEN, false, "We will need to play sounds during the study, so please turn on your speakers or put on your headphones now.<br /><br />If you don't have a sound device, "+'please contact the experimenter at akadambi@ucla.edu with the code "NO-SOUND-DEVICE".'],
    [SHOW_SOUND_TEST, false, 'Now, please play the calibration sound to adjust the volume. Make sure you can clearly and comfortably hear the sound. Press SPACE when you are done.'],
    [false, false, 'In this study, you will be playing a game that measure your perceptual sensitivity.'],
    [false, false, "Before I explain the details of how to play the game, let me just quickly show you what the game looks like when I played it."],
    [false, SHOW_GAME_DEMO, ''],
    [SHOW_INITIAL_DISPLAY, false, 'Now onto the explanations:<br />You will be playing this game multiple times. Each game started with a blue wavy line in the center (see the image below). There is a white dot in the beginning of the line, and a yellow ball at the end of the line.'],
    [HIDE_INSTR_IMG, false, 'To start the game, you will move your cursor to the white dot and click on it to start. After that, your cursor will be hidden from your view.'],
    [SHOW_TRACE_DISPLAY, false, 'Once the game start, as you move your (hidden) cursor, it will leave a red trace (see the image below).<br /><br />You will NOT need to press any mouse buttons during this!'],
    [HIDE_INSTR_IMG, false, 'You job is to trace the blue wavy line with your cursor, as closely as possible.<br /><br />Try it once on the next page!'],
    [false, RUN_TRACING_PRACTICE, ''],
    [HIDE_ALL_BOXES, SHOW_AGAIN_BUTTON_FOR_TRACING_PRACTICE, "Got it?<br />Hit AGAIN if you'd like to give it another try.<br />Otherwise, hit NEXT."],
    [HIDE_AGAIN_BUTTON, false, 'You may have noticed that the yellow ball moved during the game. In each game, it may stay static, appear to be pushed away, or move away on its own. Whichever happens, your job is to remain calm and carry on.'],
    [false, false, 'You may have also noticed that there is this clicking sound during the game. That sound serves to guide the speed of your cursor movements.'],
    [false, false, "Try your best to control your cursor's speed this way:<br />Reach the peak or valley of the wave at each click.<br /><br />Let me show you an example on the next page."],
    [false, SHOW_TEMPO_DEMO, ''],
    [false, SHOW_AGAIN_BUTTON_FOR_TEMPO_DEMO, "Does this make sense?<br />You can watch the example again by clicking AGAIN.<br />Otherwise, click NEXT to try it once yourself!"],
    [HIDE_AGAIN_BUTTON, RUN_TEMPO_PRACTICE, ''],
    [HIDE_ALL_BOXES, SHOW_AGAIN_BUTTON_FOR_TEMPO_PRACTICE, "Got it?<br />Hit AGAIN if you'd like to give it another try.<br />Otherwise, hit NEXT."],
    [HIDE_AGAIN_BUTTON, false, 'It is VERY important for me that you trace the line in the specified speed as accurately as possible. The game will be interrupted by a warning if you stray too far, and you will have to repeat that particular game later.'],
    [BIND_TEMPO_PRACTICE_BLOCK, false, 'Before I continue the explanation, please play a few practice games to get use to the rhythm.<br /><br />Press SPACE to start the practice!'],
    [false, RUN_TEMPO_BLOCK, ''],
    [false, false, "You're done with the practice! Thanks!<br /><br />Now here's one more trick for the formal games! Sometimes, the red trace will NOT be from your cursor movements, but from a prerecorded game."],
    [false, false, 'So after each game, you will be asked to guess whether the red trace was yours or a prerecorded one.<br /><br />Try it once on the next page!'],
    [false, RUN_FULL_PRACTICE, ''],
    [HIDE_ALL_BOXES, SHOW_AGAIN_BUTTON_FOR_FULL_PRACTICE, 'That was a prerecorded one. Can you tell?<br /><br />You can look at it again by clicking AGAIN, or move on by clicking NEXT.'],
    [HIDE_AGAIN_BUTTON, false, "Sometimes, you may be relatively confident that it's yours or a precorded trace, sometimes you may not. Either way is completely fine. Just make your best guess."],
    [false, false, 'A quick review:<br />(1) Click on the white dot to start.<br />(2) Trace the blue line following the tempo of the click sound.<br />(3) Make your best guess whether the red trace is yours or not.'],
    [false, false, "That's it! I hope this sounds fun!<br />The next page is a quick instruction quiz. (It's very easy!)"],
    [false, SHOW_INSTR_QUESTION, ''],
    [BIND_START_EXPERIMENT, false, 'Great! Now you may start the formal games by press SPACE!'],
    [false, false, 'You are almost done! I need you to play 2 last games with a small change.'],
    [false, false, "This time, I won't be asking you whether the trace is yours or prerecorded. They will always be yours."],
    [BIND_MANIPULATION_CHECK, false, 'Instead, please pay attention to your overall impressions of the displays throughout these 2 games. I will ask you 2 quick questions after.<br /><br />Press SPACE to start!'],
    [false, false, 'In these 2 games you just played, the yellow ball moved in different ways and that sometimes gives rise to different impressions.'],
    [BIND_MANIPULATION_CHECK_QUESTIONS, false, 'Even though you clearly know that it was just a yellow disk on the screen, sometimes you may still have an impression that it appears to be alive or acting socially.<br /><br />On the next page, I am going to ask you two questions about those impressions.'],
];

const REST_INSTRUCTION = 'You are done with ##% of the study!<br /><br />Take a short break now and hit space to continue whenever you are ready.';

function SHOW_CONSENT() {
    $('#consent-box').show();
}

function HIDE_CONSENT() {
    $('#consent-box').hide();
}

function SHOW_INSTR_IMG(file_name) {
    $('#instr-img').attr('src', STIM_PATH + file_name);
    $('#instr-img').css('display', 'block');
}

function HIDE_INSTR_IMG() {
    $('#instr-img').css('display', 'none');
}

function SWITCH_TO_FULL_SCREEN() {
    $('#instr-img').css('display', 'none');
    subj.launchFullscreen();
}

function SHOW_SOUND_TEST() {
    BIND_SPACE_PRESS_EVENT_LISTENER(END_SOUND_TEST);
    $('#sound-test-play-button').show();
    $('#sound-test-play-button').on('click', function() {
        $('#sound-test-aud').play();
    });
}

function END_SOUND_TEST() {
    $('#sound-test-aud').pause();
    $('#sound-test-play-button').hide();
    $('#sound-test-play-button').off('click');
    $('#next-button').show();
    instr.next();
}

function SHOW_INITIAL_DISPLAY() {
    SHOW_INSTR_IMG('initial_display.jpg');
}

function SHOW_TRACE_DISPLAY() {
    SHOW_INSTR_IMG('trace_display.jpg');
}

function SHOW_DEMO(id) {
    $('#instr-text').hide();
    let video_obj = $('#'+id);
    video_obj.css('display', 'block');
    video_obj[0].play();
    video_obj.on('ended', function(){
        video_obj.off('ended');
        video_obj.css('display', 'none');
        instr.next();
    });
}

function SHOW_GAME_DEMO() {
    SHOW_DEMO('game-demo-vid');
}

function SHOW_TEMPO_DEMO() {
    SHOW_DEMO('tempo-demo-vid');
}

function SHOW_AGAIN_BUTTON(func) {
    function SHOW_AGAIN() {
        $('#again-button').off('click');
        instr.index -= 1;
        func();
    }
    $('#again-button').on('click', SHOW_AGAIN);
    $('#again-button').css('display','block');
}

function HIDE_AGAIN_BUTTON() {
    $('#again-button').hide();
}

function SHOW_AGAIN_BUTTON_FOR_TRACING_PRACTICE() {
    SHOW_AGAIN_BUTTON(RUN_TRACING_PRACTICE);
}

function SHOW_AGAIN_BUTTON_FOR_TEMPO_DEMO() {
    SHOW_AGAIN_BUTTON(SHOW_TEMPO_DEMO);
}

function SHOW_AGAIN_BUTTON_FOR_TEMPO_PRACTICE() {
    SHOW_AGAIN_BUTTON(RUN_TEMPO_PRACTICE);
}

function SHOW_AGAIN_BUTTON_FOR_FULL_PRACTICE() {
    SHOW_AGAIN_BUTTON(RUN_FULL_PRACTICE);
}

function RUN_TRACING_PRACTICE() {
    instr.saveReadingTime();
    $('#instr-box').hide();
    $('#task-box').show();
    // XXX practice for tracing only but with sounds
    // end with instr.next()
}

function RUN_TEMPO_PRACTICE() {
    instr.saveReadingTime();
    $('#instr-box').hide();
    $('#task-box').show();
    // XXX practice for tracing in the right speed with sounds
    // end with instr.next()
}

function RUN_FULL_PRACTICE() {
    instr.saveReadingTime();
    $('#instr-box').hide();
    $('#task-box').show();
    // XXX run a full trial
    // end with instr.next()
}

function HIDE_ALL_BOXES() {
    $('.page-box').hide();
}

function SHOW_INSTR_QUESTION() {
    instr.saveReadingTime();
    $('#instr-box').hide();
    $('#instr-q-box').show();
    ('#instr-q-button').on('click', SUBMIT_INSTR_Q);
}

function SUBMIT_INSTR_Q() {
    let instrChoice = $('input[name="instr-q"]:checked').val();
    if (typeof instrChoice === 'undefined') {
        $('#instr-q-warning').text('Please answer the question. Thank you!');
    } else if (instrChoice != 'remember') {
        instr.qAttemptN['onlyQ'] += 1;
        instr.saveReadingTime();
        $('#instr-text').html('You have given an incorrect answer. Please read the instructions again carefully.');
        $('#instr-box').show();
        $('#instr-q-box').hide();
        $('input[name="instr-q"]:checked').prop('checked', false);
        instr.index = -1;
    } else {
        instr.next();
        $('#instr-q-box').hide();
    }
}

function BIND_SPACE_PRESS_EVENT_LISTENER(func) {
    $('#next-button').hide();
    $(document).keyup(function(e) {
        if (e.code == 'Space') {
            $(document).off('keyup');
            instr.saveReadingTime();
            $('#instr-box').hide();
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
    BIND_SPACE_PRESS_EVENT_LISTENER(RUN_MANIPULATION_CHECK);
}

function BIND_MANIPULATION_CHECK_QUESTIONS() {
    $('#next-button').off('click');
    $('#next-button').on('click', SHOW_MANIPULATION_CHECK_QUESTIONS);
}

function SHOW_MANIPULATION_CHECK_QUESTIONS() {
    instr.saveReadingTime();
    $('#instr-box').hide();
    $('#manipulation-check-q-box').show();
    $('#manipulation-check-q-button').on('click', SUBMIT_MANIPULATION_CHECK_QUESTIONS)
}

function SUBMIT_MANIPULATION_CHECK_QUESTIONS() {
    let choice_dict = {
        alive: $('input[name="alive"]:checked').val(),
        social: $('input[name="social"]:checked').val(),
    };
    if (CHECK_IF_ALL_OBJECT_KEYS_HAVE_DEFINED_VALUE({}, choice_dict)) {
        $('#manipulation-check-q-box').hide();
        SHOW_DEBRIEFING();
        Object.assign(subj, choice_dict);
        subj.instrReadingTimes = JSON.stringify(instr.readingTimes);
        subj.quickReadingPageN = Object.values(instr.readingTimes).filter(d => d < INSTR_READING_TIME_MIN).length;
    } else {
        $('#manipulation-check-q-warning').text('Please answer all questions to continue. Thank you!');
    }
}


// ######## ########  ####    ###    ##
//    ##    ##     ##  ##    ## ##   ##
//    ##    ##     ##  ##   ##   ##  ##
//    ##    ########   ##  ##     ## ##
//    ##    ##   ##    ##  ######### ##
//    ##    ##    ##   ##  ##     ## ##
//    ##    ##     ## #### ##     ## ########

const TRIAL_TITLES = [
    'num',
    'date',
    'subjStartTime',
    'blockNum',
    'restCount',
    'trialNum',
    'triggerType',
    'traceType',
    'traceNum',
    'orientation',
    'selfTrace',
    'otherTrace',
    'recycled',
    'interrupted',
    'startDeviationX',
    'startDeviationY',
    'endDeviationX',
    'endDeviationY',
    'maxSpatialDeviation',
    'maxTemporalDeviation',
    'recognition',
    'startDelay',
    'traceDuration',
    'startToTriggerDuration',
    'objectMoveDuration',
    'startToObjectEndRT',
    'recognitionRT',
    'inView',
    'inFullScreen'
];

function RUN_TEMPO_BLOCK() {
    $('#task-box').show();
    // XXX not yet written
    $('#task-box').hide();
    $('#next-button').show();
    instr.next();
}

function RUN_TASK() {
    // subj.saveAttrition(); XXX
    game = new gameObject(game_options);
    $('#task-box').show();
    game.canvasOffsetLeft = game.canvasElement.offset().left;
    game.canvasOffsetTop = game.canvasElement.offset().top;
    trial.interrupted = false;
    trial.run();
}

function RUN_MANIPULATION_CHECK() {
    $('#task-box').show();
    // XXX not yet written
    $('#task-box').hide();
    $('#next-button').show();
    instr.next();
}

function TRIAL_UPDATE(formal_trial, last, this_trial, next_trial, path) {
    trial.triggerType = this_trial['triggerType'];
    trial.traceType = this_trial['traceType'];
    trial.orientation = this_trial['orientation'];
    trial.recycled = this_trial['recycled'];
    trial.interrupted = false;
    trial.otherTrace = false;
    if (trial.traceType == 'other') {
        // trial.traceNum = trial.triggerType + trial.orientation.toString();
        // trial.otherTrace = TRACE_DICT[trial.traceNum]; XXX
        let now_other_trace = RAND_CHOICE([YC_TRAJECTORY,YC_TRAJECTORY_2, YC_TRAJECTORY_3, YC_TRAJECTORY_4]); // XXX
        trial.otherTrace = now_other_trace.slice(); // XXX
    }
    const THIS_GAME = {
        triggerType: this_trial['triggerType'],
        traceType: this_trial['traceType'],
        orientation: this_trial['orientation'],
        otherTrajectory: trial.otherTrace
    };
    game.update(THIS_GAME);
}

function TRIAL() {
    trial.inView = CHECK_FULLY_IN_VIEW($('#task-box'));
    trial.fullscreen = CHECK_IF_FULLSCREEN();
    const START_TIME = Date.now();
    $('#start-mark').click(function(){
        $('#start-mark').off('click');
        game.start(START_TIME);
    });
}

function INTERRUPT(error_type) {
    $('body').css('cursor', 'default');
    alert(error_type); // XXX error_type = spatial or temporal
    trial.interrupted = error_type;
    trial.trialList.push({'triggerType': trial.triggerType, 'traceType': trial.traceType, 'orientation': trial.orientation, 'recycled': true}) // XXX don't do this for practice
    subj.recycledCount += 1;
    // if (subj.recycledCount < RECYCLE_COUNT_CAP) { XXX
        trial.runRestOrEnd($('#task-box'), $('#rest-box'), $('#rest-text'), REST_INSTRUCTION);
    // } else { XXX
    //     trial.complete = true;
    //     END_TASK();
    //     subj.recycleReachedMax = true;
    // }
}

function GAME_END() {
    $('body').css('cursor', 'default');
    trial.startDelay = game.startDelay;
    trial.traceDuration = game.traceRT;
    trial.startToObjectEndRT = game.startToObjectEndRT;
    trial.selfTrace = game.selfTrajectory;
    trial.startDeviationX = game.startDeviationX;
    trial.startDeviationY = game.startDeviationY;
    trial.endDeviationX = game.endDeviationX;
    trial.endDeviationY = game.endDeviationY;
    trial.maxSpatialDeviation = game.maxSpatialDeviation;
    trial.maxTemporalDeviation = game.maxTemporalDeviation;
    trial.startToTriggerDuration = game.startToTriggerDuration;
    trial.objectMoveDuration = game.objectMoveDuration;
    trial.recognition = game.recognition;
    trial.recognitionRT = game.recognitionRT;
    if (trial.trialNum > 0) {
        const DATA_LIST = LIST_FROM_ATTRIBUTE_NAMES(trial, trial.titles);
        trial.allData += LIST_TO_FORMATTED_STRING(DATA_LIST);
    }
    trial.runRestOrEnd($('#task-box'), $('#rest-box'), $('#rest-text'), REST_INSTRUCTION);
}

function END_TASK() {
    $('#task-box').hide();
    trial.save();
    SHOW_DEBRIEFING_QUESTIONS();
}
