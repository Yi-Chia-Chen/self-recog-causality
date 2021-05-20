// Yi-Chia Chen

// ########  #######  ########  ##     ##    ###    ########
// ##       ##     ## ##     ## ###   ###   ## ##      ##
// ##       ##     ## ##     ## #### ####  ##   ##     ##
// ######   ##     ## ########  ## ### ## ##     ##    ##
// ##       ##     ## ##   ##   ##     ## #########    ##
// ##       ##     ## ##    ##  ##     ## ##     ##    ##
// ##        #######  ##     ## ##     ## ##     ##    ##

function CAPITALIZE(s) {
    if (typeof s !== "string") {
        return "";
    } else {
        return s.charAt(0).toUpperCase() + s.slice(1);
    }
}

function REPLACE_SLASH_R_N_WITH_BR(input) {
    return input.toString().replace(/(?:\r\n|\r|\n)/g, "<br />");
}

function REPLACE_LINE_BREAK_IN_ENTRY_VALUE([key, value]) {
    return [key, REPLACE_SLASH_R_N_WITH_BR(value)];
}

function LIST_TO_FORMATTED_STRING(data_list, divider) {
    divider = divider === undefined ? "\t" : divider;
    let string = "";
    for (let i = 0; i < data_list.length - 1; i++) {
        string += data_list[i] + divider;
    }
    string += data_list[data_list.length - 1] + "\n";
    return string;
}

function TWO_D_ARRAY_TO_STRING(input_array) {
    let arr = Array.from(input_array);
    for (let i = 0; i < arr.length; i++) {
        arr[i] = "[" + arr[i].toString() + "]";
    }
    return "[" + arr.toString() + "]";
}

function THREE_D_ARRAY_TO_STRING(input_array) {
    let arr = Array.from(input_array);
    for (let i = 0; i < arr.length; i++) {
        if (Array.isArray(arr[i])) {
            for (let j = 0; j < arr[i].length; j++) {
                arr[i][j] = "[" + arr[i][j].toString() + "]";
            }
        } else {
            arr[i] = arr[i].toString();
        }
    }
    return "[" + arr.toString() + "]";
}

function FORMAT_DATE(date_obj, time_zone, divider, padded) {
    date_obj = date_obj === undefined ? new Date() : date_obj;
    time_zone = time_zone === undefined ? "UTC" : time_zone;
    divider = divider === undefined ? "." : divider;
    padded = padded === undefined ? true : padded;
    const NOW_YEAR =
        time_zone == "UTC" ? date_obj.getUTCFullYear() : date_obj.getFullYear();
    let now_month =
        time_zone == "UTC"
            ? date_obj.getUTCMonth() + 1
            : date_obj.getMonth() + 1;
    let now_date =
        time_zone == "UTC" ? date_obj.getUTCDate() : date_obj.getDate();
    if (padded) {
        now_month = ("0" + now_month).slice(-2);
        now_date = ("0" + now_date).slice(-2);
    }
    return NOW_YEAR + divider + now_month + divider + now_date;
}

function FORMAT_TIME(date_obj, time_zone, divider, padded) {
    date_obj = date_obj === undefined ? new Date() : date_obj;
    time_zone = time_zone === undefined ? "UTC" : time_zone;
    divider = divider === undefined ? ":" : divider;
    padded = padded === undefined ? true : padded;
    let now_hours =
        time_zone == "UTC" ? date_obj.getUTCHours() : date_obj.getHours();
    let now_minutes =
        time_zone == "UTC" ? date_obj.getUTCMinutes() : date_obj.getMinutes();
    let now_seconds =
        time_zone == "UTC" ? date_obj.getUTCSeconds() : date_obj.getSeconds();
    if (padded) {
        now_hours = ("0" + now_hours).slice(-2);
        now_minutes = ("0" + now_minutes).slice(-2);
        now_seconds = ("0" + now_seconds).slice(-2);
    }
    return now_hours + divider + now_minutes + divider + now_seconds;
}

// ##     ##    ###    ######## ##     ##
// ###   ###   ## ##      ##    ##     ##
// #### ####  ##   ##     ##    ##     ##
// ## ### ## ##     ##    ##    #########
// ##     ## #########    ##    ##     ##
// ##     ## ##     ##    ##    ##     ##
// ##     ## ##     ##    ##    ##     ##

function TO_RADIANS(degrees) {
    return (degrees * Math.PI) / 180;
}

function TO_DEGREES(radians) {
    return ((radians * 180) / Math.PI) % 360;
}

function POSITIVE_MOD(value, divider) {
    return ((value % divider) + divider) % divider;
}

//  ######   ########  #######  ##     ## ######## ######## ########  ##    ##
// ##    ##  ##       ##     ## ###   ### ##          ##    ##     ##  ##  ##
// ##        ##       ##     ## #### #### ##          ##    ##     ##   ####
// ##   #### ######   ##     ## ## ### ## ######      ##    ########     ##
// ##    ##  ##       ##     ## ##     ## ##          ##    ##   ##      ##
// ##    ##  ##       ##     ## ##     ## ##          ##    ##    ##     ##
//  ######   ########  #######  ##     ## ########    ##    ##     ##    ##

function POLAR_TO_CARTESIAN(r, theta) {
    return [r * Math.cos(TO_RADIANS(theta)), r * Math.sin(TO_RADIANS(theta))];
}

function TWO_D_VECTOR_ROTATION(ori, vector) {
    const I_RAD = TO_RADIANS(ori);
    const J_RAD = TO_RADIANS(ori + 90);
    let rotated_i_hat = [Math.cos(I_RAD), Math.sin(I_RAD)];
    let rotated_j_hat = [Math.cos(J_RAD), Math.sin(J_RAD)];
    let rotated_x = rotated_i_hat.map((a) => a * vector["x"]);
    let rotated_y = rotated_j_hat.map((a) => a * vector["y"]);
    return {
        x: rotated_x[0] + rotated_y[0],
        y: rotated_x[1] + rotated_y[1]
    };
}

function MOVE_ORIGIN_FROM_TOP_LEFT_TO_CENTER(vector, area_size) {
    return {
        x: vector["x"] - area_size["w"] / 2,
        y: area_size["h"] / 2 - vector["y"]
    };
}

function MOVE_ORIGIN_FROM_CENTER_TO_TOP_LEFT(vector, area_size) {
    return {
        x: vector["x"] + area_size["w"] / 2,
        y: area_size["h"] / 2 - vector["y"]
    };
}

function VECTOR_LENGTH(x_diff, y_diff) {
    return Math.sqrt(Math.pow(x_diff, 2) + Math.pow(y_diff, 2));
}

function DISTANCE_BETWEEN_POINTS(point_a, point_b) {
    const X_DIFF = point_a[0] - point_b[0];
    const Y_DIFF = point_a[1] - point_b[1];
    return VECTOR_LENGTH(X_DIFF, Y_DIFF);
}

function MIDPOINT_OF_TWO_POINTS(point_1, point_2) {
    return [(point_1[0] + point_2[0]) / 2, (point_1[1] + point_2[1]) / 2];
}

function SLOPE_FROM_POINTS(point_1, point_2) {
    const X_1 = point_1[0];
    const Y_1 = point_1[1];
    const X_2 = point_2[0];
    const Y_2 = point_2[1];
    return (Y_2 - Y_1) / (X_2 - X_1);
}

function Y_INTERCEPT_FROM_POINTS(point_1, point_2) {
    const X_1 = point_1[0];
    const Y_1 = point_1[1];
    const X_2 = point_2[0];
    const Y_2 = point_2[1];
    return (X_2 * Y_1 - X_1 * Y_2) / (X_2 - X_1);
}

function LINE_ANGLE_TO_X_AXIS(slope) {
    return TO_DEGREES(Math.atan(slope)) % 360;
}

function INTERSECTION_OF_TWO_LINES(
    slope_1,
    y_intercept_1,
    slope_2,
    y_intercept_2
) {
    const INTERSECTION_X =
        (y_intercept_2 - y_intercept_1) / (slope_1 - slope_2);
    const INTERSECTION_Y =
        (slope_1 * y_intercept_2 - slope_2 * y_intercept_1) /
        (slope_1 - slope_2);
    return [INTERSECTION_X, INTERSECTION_Y];
}

function VERTICAL_LINE_INTERSECTION_FROM_POINT_TO_LINE(
    point_0,
    slope,
    y_intercept
) {
    const X_0 = point_0[0];
    return [X_0, slope * X_0 + y_intercept];
}

function HORIZONTAL_LINE_INTERSECTION_FROM_POINT_TO_LINE(
    point_0,
    slope,
    y_intercept
) {
    const Y_0 = point_0[1];
    return [(Y_0 - y_intercept) / slope, Y_0];
}

function POINT_TO_LINE_DISTANCE(point_0, slope, y_intercept) {
    const INTERSECTION_X_POINT = VERTICAL_LINE_INTERSECTION_FROM_POINT_TO_LINE(
        point_0,
        slope,
        y_intercept
    );
    const INTERSECTION_Y_POINT =
        HORIZONTAL_LINE_INTERSECTION_FROM_POINT_TO_LINE(
            point_0,
            slope,
            y_intercept
        );
    const HYPOTENUSE = DISTANCE_BETWEEN_POINTS(
        INTERSECTION_X_POINT,
        INTERSECTION_Y_POINT
    );
    return (INTERSECTION_X_POINT * INTERSECTION_Y_POINT) / HYPOTENUSE;
}

function PERPENDICULAR_LINE_OF_A_LINE_PASSING_A_POINT(point_0, slope) {
    const PERPENDICULAR_SLOPE = -1 / slope;
    const Y_INTERCEPT = point_0[1] - PERPENDICULAR_SLOPE * point_0[0];
    return [PERPENDICULAR_SLOPE, Y_INTERCEPT];
}

function FOOT_OF_PERPENDICULAR(point_0, slope, y_intercept) {
    const PERPENDICULAR_LINE = PERPENDICULAR_LINE_OF_A_LINE_PASSING_A_POINT(
        point_0,
        slope
    );
    return INTERSECTION_OF_TWO_LINES(
        slope,
        y_intercept,
        PERPENDICULAR_LINE[0],
        PERPENDICULAR_LINE[1]
    );
}

function REFLECTION_POINT_THROUGH_A_LINE(point_0, slope, y_intercept) {
    const FOOT = FOOT_OF_PERPENDICULAR(point_0, slope, y_intercept);
    const FOOT_X = FOOT[0];
    const FOOT_Y = FOOT[1];
    const X_0 = point_0[0];
    const Y_0 = point_0[1];
    return [2 * FOOT_X - X_0, 2 * FOOT_Y - Y_0];
}

function PERPENDICULAR_BISECTOR(point_1, point_2) {
    const MIDPOINT = MIDPOINT_OF_TWO_POINTS(point_1, point_2);
    const SLOPE = -1 / SLOPE_FROM_POINTS(point_1, point_2);
    const Y_INTERCEPT = MIDPOINT[1] - SLOPE * MIDPOINT[0];
    return [SLOPE, Y_INTERCEPT];
}

//    ###    ########  ########     ###    ##    ##
//   ## ##   ##     ## ##     ##   ## ##    ##  ##
//  ##   ##  ##     ## ##     ##  ##   ##    ####
// ##     ## ########  ########  ##     ##    ##
// ######### ##   ##   ##   ##   #########    ##
// ##     ## ##    ##  ##    ##  ##     ##    ##
// ##     ## ##     ## ##     ## ##     ##    ##

function RANGE(start_num, end_num, interval) {
    start_num = start_num === undefined ? 0 : start_num;
    interval = interval === undefined ? 1 : interval;
    let list = [];
    for (let i = start_num; i < end_num; i += interval) {
        list.push(i);
    }
    return list;
}

function SHUFFLE_ARRAY(input_array) {
    let j, temp;
    let arr = Array.from(input_array);
    for (let i = arr.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
    }
    return arr;
}

function RAND_CHOICE(list) {
    return list[Math.floor(Math.random() * list.length)];
}

function SAMPLE_WO_REPLACEMENT(list, sample_n) {
    sample_n = sample_n === undefined ? 1 : sample_n;
    let sample = [];
    let local_list = Array.from(list);
    for (let i = 0; i < sample_n; i++) {
        let random_index = Math.floor(Math.random() * local_list.length);
        sample.push(local_list.splice(random_index, 1)[0]);
    }
    return {
        sample: sample,
        remainder: local_list
    };
}

function SAMPLE_W_REPLACEMENT(list, sample_n) {
    sample_n = sample_n === undefined ? 1 : sample_n;
    let sample = [];
    let local_list = Array.from(list);
    for (let i = 0; i < sample_n; i++) {
        let random_index = Math.floor(Math.random() * local_list.length);
        sample.push(local_list[random_index]);
    }
    return sample;
}

function CHECK_IN_ARRAY(value, arr) {
    if (arr.indexOf(value) >= 0) return true;
    return false;
}

function REMOVE_ARRAY_ELEMENTS_BASED_ON_ANOTHER_ARRAY(arr_keep, arr_remove) {
    return arr_keep.filter((v) => !CHECK_IN_ARRAY(v, arr_remove));
}

function REPEAT_ELEMENTS_IN_ARRAY(arr, repeat_n) {
    let new_arr = [];
    for (let x of arr) {
        for (let j = 0; j < repeat_n; j++) {
            if (Array.isArray(x)) {
                new_arr.push(x.slice());
            } else {
                new_arr.push(x);
            }
        }
    }
    return new_arr;
}

function CONCAT_DUPLICATED_ARRAY(arr, repeat_n) {
    let new_arr = [];
    for (let i = 0; i < repeat_n; i++) {
        new_arr = new_arr.concat(arr.slice());
    }
    return new_arr;
}

function CONVERT_ARRAY_TO_DICT_WITH_INDEX_AS_KEY(arr) {
    let dict = {};
    arr.forEach((x, i) => (dict[i] = x));
    return dict;
}

function CREATE_RANDOM_REPEAT_BEGINNING_LIST(stim_list, repeat_trial_n) {
    const REPEAT_LIST = SHUFFLE_ARRAY(stim_list.slice()).splice(
        0,
        repeat_trial_n
    );
    return REPEAT_LIST.concat(stim_list);
}

function RECURSIVE_COMBINE(current_factor, remain_factor_list, conditions) {
    conditions = REPEAT_ELEMENTS_IN_ARRAY(
        conditions.slice(),
        current_factor.length
    );
    for (let j = 0; j < conditions.length; j += current_factor.length) {
        for (let k = 0; k < current_factor.length; k++) {
            let index = j + k;
            conditions[index].push(current_factor[k]);
        }
    }
    if (remain_factor_list.length !== 0) {
        current_factor = remain_factor_list.shift();
        return RECURSIVE_COMBINE(
            current_factor,
            remain_factor_list,
            conditions
        );
    } else {
        return conditions.slice();
    }
}

function FACTORIAL_COND(factor_list) {
    let now_factor = factor_list.shift();
    let all_conditions = [];
    for (let f of now_factor) {
        all_conditions.push([f]);
    }
    now_factor = factor_list.shift();
    all_conditions = RECURSIVE_COMBINE(now_factor, factor_list, all_conditions);
    return all_conditions;
}

//  #######  ########        ## ########  ######  ########
// ##     ## ##     ##       ## ##       ##    ##    ##
// ##     ## ##     ##       ## ##       ##          ##
// ##     ## ########        ## ######   ##          ##
// ##     ## ##     ## ##    ## ##       ##          ##
// ##     ## ##     ## ##    ## ##       ##    ##    ##
//  #######  ########   ######  ########  ######     ##

function APPLY_FUNCTION_TO_OBJ(obj, func) {
    return Object.entries(obj).map(([key, value]) => func([key, value]));
}

function SET_LIST_OF_OBJECT_ATTRIBUTE_TO_THIS_VALUE(obj, attributes, value) {
    for (let attr of attributes) {
        obj[attr] = value;
    }
}

// ######## #### ##     ## ########
//    ##     ##  ###   ### ##
//    ##     ##  #### #### ##
//    ##     ##  ## ### ## ######
//    ##     ##  ##     ## ##
//    ##     ##  ##     ## ##
//    ##    #### ##     ## ########

function REQUEST_TIMEOUT(to_do, delay) {
    const START_TIME = Date.now();
    function loop() {
        const TIME_ELAPSED = Date.now() - START_TIME;
        if (TIME_ELAPSED >= delay) {
            to_do();
        } else {
            request_id = requestAnimationFrame(loop);
            REGISTER_CANCEL_FUNCTION(function () {
                cancelAnimationFrame(request_id);
            });
        }
    }
    let request_id = requestAnimationFrame(loop);
    REGISTER_CANCEL_FUNCTION(function () {
        cancelAnimationFrame(request_id);
    });
}

function REQUEST_CANCEL() {
    // register automatically
}

function REGISTER_CANCEL_FUNCTION(func) {
    REQUEST_CANCEL = func;
}

// ########  ########  #######  ######## ##     ##  ######  ########
// ##     ## ##       ##     ## ##       ##     ## ##    ##    ##
// ##     ## ##       ##     ## ##       ##     ## ##          ##
// ########  ######   ##     ## ######   ##     ##  ######     ##
// ##   ##   ##       ##  ## ## ##       ##     ##       ##    ##
// ##    ##  ##       ##    ##  ##       ##     ## ##    ##    ##
// ##     ## ########  ##### ## ########  #######   ######     ##

function GET_PARAMETERS(var_name, default_value) {
    const REGEX_STRING = "[?&]" + var_name + "=([^&#]*)";
    const REGEX = new RegExp(REGEX_STRING);
    const URL = location.href;
    const RESULTS = REGEX.exec(URL);
    if (RESULTS == null) {
        return default_value;
    } else {
        return RESULTS[1];
    }
}

function POST_DATA(page, data, success_func, error_callback) {
    data = data === undefined ? null : data;
    success_func =
        success_func === undefined
            ? function () {
                  return;
              }
            : success_func;
    error_callback =
        error_callback === undefined
            ? function () {
                  return;
              }
            : error_callback;
    $.ajax({
        type: "POST",
        url: page,
        data: data,
        success: success_func,
        error: error_callback
    });
}

// ##        #######     ###    ########  #### ##    ##  ######
// ##       ##     ##   ## ##   ##     ##  ##  ###   ## ##    ##
// ##       ##     ##  ##   ##  ##     ##  ##  ####  ## ##
// ##       ##     ## ##     ## ##     ##  ##  ## ## ## ##   ####
// ##       ##     ## ######### ##     ##  ##  ##  #### ##    ##
// ##       ##     ## ##     ## ##     ##  ##  ##   ### ##    ##
// ########  #######  ##     ## ########  #### ##    ##  ######

function ADD_PREFIX_TO_LIST_OF_STRING(strings, prefix) {
    let output_list = [];
    for (let s of strings) {
        output_list.push(prefix + s);
    }
    return output_list;
}

function LOAD_SCRIPT(index, script_list, after_func) {
    after_func =
        after_func === undefined
            ? function () {
                  return;
              }
            : after_func;
    if (index >= script_list.length) {
        return;
    }
    let head = document.head;
    let script = document.createElement("script");
    script.src = script_list[index];
    if (index < script_list.length - 1) {
        script.onload = function () {
            LOAD_SCRIPT(index + 1, script_list, after_func);
        };
    } else {
        script.onload = after_func;
    }
    head.appendChild(script);
}

function LOAD_IMG(index, stim_path, img_list, after_func) {
    after_func =
        after_func === undefined
            ? function () {
                  return;
              }
            : after_func;
    if (index >= img_list.length) {
        return;
    }
    const IMAGE = new Image();
    if (index < img_list.length - 1) {
        IMAGE.onload = function () {
            LOAD_IMG(index + 1, stim_path, img_list, after_func);
        };
    } else {
        IMAGE.onload = after_func;
    }
    IMAGE.src = stim_path + img_list[index];
}

function LOAD_SOUNDS(index, stim_path, sound_list, after_func) {
    if (index >= sound_list.length) {
        return;
    }
    const SOUND = new Audio();

    SOUND.src = stim_path + sound_list[index];

    function CHECK_STATE() {
        if (SOUND.readyState == 4) {
            clearInterval(check_loading);
            if (index < sound_list.length - 1) {
                LOAD_SOUNDS(index + 1, stim_path, sound_list, after_func);
            } else {
                after_func();
            }
        } else {
            let current_time = Date.now();
            let current_duration = (current_time - START_TIME) / 1000; // in second
            if (current_duration > 2) {
                clearInterval(check_loading);
                if (reload_num > 3) {
                    // giving up
                    if (index < sound_list.length - 1) {
                        LOAD_SOUNDS(
                            index + 1,
                            stim_path,
                            sound_list,
                            after_func
                        );
                    } else {
                        after_func();
                    }
                } else {
                    // try reloading again
                    reload_num++;
                    SOUND.load();
                    check_loading = window.setInterval(CHECK_STATE, 20); // update progress every intervalD ms
                }
            }
        }
    }

    const START_TIME = Date.now();
    let reload_num = 0;
    let check_loading = window.setInterval(CHECK_STATE, 20); // update progress every intervalD ms
}

function BUFFER_VIDEO(buffer_element, filename, error_func, after_func) {
    error_func =
        error_func === undefined
            ? function () {
                  return;
              }
            : error_func;
    after_func =
        after_func === undefined
            ? function () {
                  return;
              }
            : after_func;
    const REQUEST = new XMLHttpRequest();
    REQUEST.open("GET", filename, true);
    REQUEST.responseType = "blob";
    REQUEST.onload = function () {
        if (this.status === 200) {
            const VIDEO_BLOB = this.response;
            const VIDEO = URL.createObjectURL(VIDEO_BLOB);
            buffer_element.src = VIDEO;
            after_func();
        }
    };
    REQUEST.onerror = error_func;
    REQUEST.send();
}

//  ######   #######  ##    ## ######## ######## ##    ## ########
// ##    ## ##     ## ###   ##    ##    ##       ###   ##    ##
// ##       ##     ## ####  ##    ##    ##       ####  ##    ##
// ##       ##     ## ## ## ##    ##    ######   ## ## ##    ##
// ##       ##     ## ##  ####    ##    ##       ##  ####    ##
// ##    ## ##     ## ##   ###    ##    ##       ##   ###    ##
//  ######   #######  ##    ##    ##    ######## ##    ##    ##

function APPEND_LIST_OF_IMG(img_path_list, img_box) {
    let img;
    for (let img_path of img_path_list) {
        img = $(document.createElement("img"));
        img.attr("src", img_path);
        img.appendTo(img_box);
    }
}

function LIST_FROM_ATTRIBUTE_NAMES(obj, string_list) {
    let list = [];
    for (let attr of string_list) {
        list.push(obj[attr]);
    }
    return list;
}

function CHECK_IF_ALL_OBJECT_KEYS_HAVE_DEFINED_VALUE(
    open_ended_list,
    choice_list
) {
    const OPEN_ITEMS = Object.entries(open_ended_list);
    const CHOICE_ITEMS = Object.entries(choice_list);

    let no_response_n = OPEN_ITEMS.filter(
        ([key, value]) => value.toString().replace("<br />", "") == ""
    ).length;
    no_response_n += CHOICE_ITEMS.filter(
        ([key, value]) => typeof value == "undefined"
    ).length;

    return no_response_n == 0;
}

function CHECK_FULLY_IN_VIEW(el) {
    el = el.get(0);
    const RECT = el.getBoundingClientRect();
    const TOP = RECT.top;
    const BOTTOM = RECT.bottom;
    const LEFT = RECT.left;
    const RIGHT = RECT.right;

    const W = $(window).width();
    const H = $(window).height();
    return TOP >= 0 && BOTTOM <= H && LEFT >= 0 && RIGHT <= W;
}

function CHECK_IF_FULLSCREEN() {
    if (
        document.fullscreenElement === null ||
        document.mozFullScreenElement === null /* Firefox 9-46 */ ||
        document.webkitFullscreenElement === null /* Safari and Opera*/ ||
        document.msFullscreenElement === null /* IE11 */
    ) {
        return false;
    } else if (
        typeof document.fullscreenElement == "undefined" &&
        typeof document.mozFullScreenElement ==
            "undefined" /* Firefox 9-46 */ &&
        typeof document.webkitFullscreenElement ==
            "undefined" /* Safari and Opera*/ &&
        typeof document.msFullscreenElement == "undefined" /* IE11 */
    ) {
        return false;
    } else {
        return true;
    }
}

// ########  ######## ######## ########  ######  ######## ####  #######  ##    ##
// ##     ## ##          ##    ##       ##    ##    ##     ##  ##     ## ###   ##
// ##     ## ##          ##    ##       ##          ##     ##  ##     ## ####  ##
// ##     ## ######      ##    ######   ##          ##     ##  ##     ## ## ## ##
// ##     ## ##          ##    ##       ##          ##     ##  ##     ## ##  ####
// ##     ## ##          ##    ##       ##    ##    ##     ##  ##     ## ##   ###
// ########  ########    ##    ########  ######     ##    ####  #######  ##    ##

function DETECT_METHOD(method_name, parent_obj) {
    return method_name in parent_obj;
}
