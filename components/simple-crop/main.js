(function ($) {
    $(function () {        
        'use strict';
        var console = window.console || { log: function () { } };
        var $image = $('#image');
        var options = {
            aspectRatio: 16 / 9
        };
        // Cropper
        $image.cropper(options);
        // Buttons
        if (!$.isFunction(document.createElement('canvas').getContext)) {
            $('button[data-method="getCroppedCanvas"]').prop('disabled', true);
        }
        // Options
        $('.docs-toggles').on('change', 'input', function () {
            var $this = $(this);
            var name = $this.attr('name');
            var type = $this.prop('type');
            var cropBoxData;
            var canvasData;

            if (!$image.data('cropper')) {
                return;
            }

            $image.cropper('destroy').cropper(options);
        });


        // Methods
        $('body').on('click', '[data-method]', function () {
            var $this = $(this);
            var data = $this.data();
            var $target;
            var result;

            if ($this.prop('disabled') || $this.hasClass('disabled')) {
                return;
            }

            if ($image.data('cropper') && data.method) {
                data = $.extend({}, data); // Clone a new one

                if (typeof data.target !== 'undefined') {
                    $target = $(data.target);

                    if (typeof data.option === 'undefined') {
                        try {
                            data.option = JSON.parse($target.val());
                        } catch (e) {
                            console.log(e.message);
                        }
                    }
                }
                result = $image.cropper(data.method, data.option, data.secondOption);
                var ImageBase64 = result.toDataURL('image/jpeg')
                $('[title="ImagemClean"]').val(ImageBase64)
                $('#ctl00_ctl33_g_c8663e1d_d44b_4dc3_a077_6e60c0331aff_ff31_ctl00_ctl00_TextField_inplacerte').html([
                    '<img src="', ImageBase64, '" />'
                ].join(''))
                $imageArea.addClass(hiddenClass)
            }
        });

        // Import image
        var $inputImage = $('#inputImage');
        var hiddenClass = 'ms-hidden'
        var $imageArea = $('#x-imageUploaderPreview');
        var URL = window.URL || window.webkitURL;
        var blobURL;

        if (URL) {
            $inputImage.change(function () {
                var files = this.files;
                var file;
                if (!$image.data('cropper')) {
                    return;
                }
                if (files && files.length) {
                    file = files[0];

                    if (/^image\/\w+$/.test(file.type)) {
                        blobURL = URL.createObjectURL(file);
                        $image.one('built.cropper', function () {

                            // Revoke when load complete
                            URL.revokeObjectURL(blobURL);
                        }).cropper('reset').cropper('replace', blobURL);
                        $inputImage.val('');
                        $imageArea.removeClass(hiddenClass)
                    } else {
                        window.alert('Please choose an image file.');
                    }
                }
            });
        } else {
            $inputImage.prop('disabled', true).parent().addClass('disabled');
        }
    });
})(jQuery)