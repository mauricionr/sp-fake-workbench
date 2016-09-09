<%@ Assembly Name="Microsoft.SharePoint, Version=16.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c"%> <%@ Page Language="C#" Inherits="Microsoft.SharePoint.WebPartPages.WikiEditPage" MasterPageFile="~masterurl/default.master"      MainContentID="PlaceHolderMain" meta:progid="SharePoint.WebPartPage.Document" meta:webpartpageexpansion="full" %>
<%@ Import Namespace="Microsoft.SharePoint.WebPartPages" %> <%@ Register Tagprefix="SharePoint" Namespace="Microsoft.SharePoint.WebControls" Assembly="Microsoft.SharePoint, Version=16.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %> <%@ Register Tagprefix="Utilities" Namespace="Microsoft.SharePoint.Utilities" Assembly="Microsoft.SharePoint, Version=16.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %> <%@ Import Namespace="Microsoft.SharePoint" %> <%@ Assembly Name="Microsoft.Web.CommandUI, Version=16.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register Tagprefix="WebPartPages" Namespace="Microsoft.SharePoint.WebPartPages" Assembly="Microsoft.SharePoint, Version=16.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<asp:Content ContentPlaceHolderId="PlaceHolderAdditionalPageHead" runat="server">

<link rel="stylesheet" href="cropper.min.css">
<script src="jquery.js"></script>
<script src="vue.js"></script>
<script src="cropper.min.js"></script>

</asp:Content>

<asp:Content ContentPlaceHolderId="PlaceHolderMain" runat="server">


<div id="app">
  <input type="file" value="Escolher imagem" id="inputImage" name="file" accept="image/*" />
  <div id="x-imageUploaderPreview" class="ms-hidden">
        <!--[if lt IE 8]>
          <p class="browserupgrade">You are using an <strong>outdated</strong> 
        browser. Please <a href="http://browsehappy.com/">upgrade your browser</a> 
        to improve your experience.</p>
        <![endif]--><!-- Content -->
        <div class="container">
          <div class="row">
            <div class="col-md-9">
              <div class="img-container">
                <img id="image" src="../../Style Library/cropper/assets/img/logo.png" alt="Picture" />
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-md-9 docs-buttons">
              <div class="btn-group">
                  <span class="docs-tooltip" data-toggle="tooltip" title="Import image with Blob URLs">
                    <span class="fa fa-upload"></span>
                  </span>
              </div>
              <div class="btn-group btn-group-crop">
                  <button type="button" class="btn btn-primary" data-method="getCroppedCanvas">
                    <span class="docs-tooltip" data-toggle="tooltip" title="$().cropper(&quot;getCroppedCanvas&quot;)">              
                      Recortar
                    </span>
                  </button>
              </div>
            </div>
          </div>
        </div>
    </div>
</div>

<script>

new Vue({
  el: '#app',
  data: {},
  ready:function(){    
        // Import image
        var $inputImage = $('#inputImage');
        var hiddenClass = 'ms-hidden'
        var $imageArea = $('#x-imageUploaderPreview');
        var URL = window.URL || window.webkitURL;
        var blobURL;
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
                            URL.revokeObjectURL(blobURL);
                        })
                        .cropper('reset')
                        .cropper('replace', blobURL);
                        
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
  },
  methods:{}
})

</script>
</asp:Content>
