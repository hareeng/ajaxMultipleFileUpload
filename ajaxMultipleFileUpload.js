(function ($) {
    $.extend({
        ajaxMultipleFileUpload: function (data) {
            var Functions = {
                createIframe: function (timeStamp) {
                    var frameId = 'jUploadFrame' + timeStamp;
                    var iframeHtml = '<iframe id="' + frameId + '" name="' + frameId + '" style="position:absolute; top:-9999px; left:-9999px" src="javascript:false" />';
                    return $(iframeHtml).appendTo(document.body);
                },
                createForm: function (timeStamp, files, additionalData, postUrl, cloneFileElements, callBackName, target) {
                    //create form	
                    var formId = 'jUploadForm' + timeStamp;
                    var form = $('<form style="position: absolute, top: -1200px, left: -1200px" method="POST" name="' + formId + '" id="' + formId + '" enctype="multipart/form-data"></form>');
                    form.attr('action', postUrl);
                    form.attr('target', target);
                    if (additionalData) {
                        $.each(additionalData, function (key, value) {
                            if (key != "callback" || !callBackName) {
                                $('<input type="hidden" name="' + key + '" />').val(value).appendTo(form);
                            }
                        });
                    }
                    if (callBackName) {
                        $('<input type="hidden" name="callback" />').val(callBackName).appendTo(form);
                    }
                    $(files).each(function () {
                        var oldElement = $(this);
                        if (cloneFileElements) {
                            var newElement = oldElement.clone();
                            oldElement.attr('id', fileId);
                            oldElement.before(newElement);
                        }
                        oldElement.appendTo(form);
                    });
                    return form.appendTo('body');
                }
            };

            var timeStamp = new Date().getTime();
            var cloneFileElements = 'cloneFileElements' in data ? data.cloneFileElements : true;
            
            var callBackName = "callback" + timeStamp;
            window[callBackName] = function (callBackData) {
                data.callback(callBackData);
            }

            var iFrame = Functions.createIframe(timeStamp);
            $(iFrame).load(function () {
                $.event.trigger("ajaxSend", [{}, data]);
                $.event.trigger("ajaxStart");
                setTimeout(function () { delete window[callBackName]; $(this).remove(); }, 3000);
            });

            var form = Functions.createForm(timeStamp, data.files, data.additionalData, data.url, cloneFileElements, callBackName, $(iFrame).attr('id'));

            $.event.trigger("ajaxStart");
            $.event.trigger("ajaxSend", [{}, data]);

            $(form).submit();
        }
    });
})(jQuery);