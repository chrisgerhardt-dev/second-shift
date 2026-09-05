function processCaptcha(form, handler) {

    $("#captcha-error").hide();

    var verification = $("#verif_box").val();

    var url = "/mariposa_client/captcha";
    var parms = "verif_box=" + verification;

    $.ajaxSetup({async: false});
    $.post(url, parms,
            function (data) {
                if (data.result == "ok") {

                    //$('.btn').attr('disabled', 'disabled');
                    $("#" + form).attr("action", handler);
                    $("#" + form).submit();

                } else {
                    $("#captcha-error").show();
                    $("#captchaImg").attr("src", "/mariposa_client/captcha/?r=" + Math.random());
                }
            },
            "json"
            );

}


function processCaptchaMulti(form, handler, cookie) {

    $("#captcha-error_" + cookie).hide();

    var verification = $("#verif_box_" + cookie).val();

    var url = "/mariposa_client/captcha/" + cookie;
    var parms = "verif_box=" + verification;
    parms += "&cookie=" + cookie;

    $.ajaxSetup({async: false});
    $.post(url, parms,
            function (data) {
                if (data.result == "ok") {
                    //$('.btn').attr('disabled', 'disabled');
                    $("#" + form).attr("action", handler);
                    $("#" + form).submit();

                } else {
                    $("#captcha-error_" + cookie).show();
                    $("#captchaImg_" + cookie).attr("src", "/mariposa_client/captcha/" + cookie + "?r=" + Math.random());
                }
            },
            "json"
            );

}


function processCaptchaMultiJquery(form, handler, cookie) {

    $("#captcha-error_" + cookie).hide();

    var verification = $("#verif_box_" + cookie).val();

    var url = "/mariposa_client/captcha/" + cookie;
    var parms = "verif_box=" + verification;
    parms += "&cookie=" + cookie;

    $.ajaxSetup({async: false});
    $.post(url, parms,
            function (data) {
                if (data.result == "ok") {
                    var valid = $("#" + form).valid();
                    if (valid) {
                        $('.btn').attr('disabled', 'disabled');
                        $("#" + form).attr("action", handler);
                        $("#" + form).submit();
                    }
                } else {
                    $("#captcha-error_" + cookie).show();
                    $("#captchaImg_" + cookie).attr("src", "/mariposa_client/captcha/" + cookie + "?r=" + Math.random());
                }
            },
            "json"
            );

}





function processCaptchaMultiInline(form, handler, cookie, successblock, errorblock) {

    $("#captcha-error_" + cookie).hide();
    $("#" + successblock).hide();
    $("#" + errorblock).hide();

    var verification = $("#verif_box_" + cookie).val();

    var url = "/mariposa_client/captcha/" + cookie;
    var parms = "verif_box=" + verification;
    parms += "&cookie=" + cookie;


    $.ajaxSetup({async: false});
    $.post(url, parms,
            function (data) {
                if (data.result == "ok") {

                    var valid = $("#" + form).valid();
                    if (valid) {
                        $('.btn').attr('disabled', 'disabled');
                        var data = $("#" + form).serialize();

                        var url = handler;

                        var jqxhr = $.post(url, data, function (res) {

                            response = JSON.parse(res);

                            if (response.response == "OK") {
                                $("#" + successblock).show();
                            } else {
                                $("#" + errorblock).show();
                            }
                        }).done(function (res) {
                            //Nothing yet
                        }).fail(function () {
                            $("#" + errorblock).show();

                        }).always(function () {
                            //alert("finished");
                        });

                    }
                } else {
                    $("#captcha-error_" + cookie).show();
                    $("#captchaImg_" + cookie).attr("src", "/mariposa_client/captcha/" + cookie + "?r=" + Math.random());
                }
            },
            "json"
            );

}