(function (Vue, $) {
    function initializeSxCropComponent(){
        var CropComponent = Vue.extend(cropComponentDefinition)
        Vue.component('sx-crop', CropComponent)
        new Vue({
            el:'#sx-crop'
        })
    }    
    var cropComponentData = function(){
        return {
            image:null,
            inputImage:null,
            imageArea:null,
            blobURL:null,
            preview:null,
            options:{
                aspectRatio: 16 / 9
            },
            hiddenClass:'ms-hidden',
            result:null,
            method:'getCroppedCanvas',
            ImageBase64:null,
            spField:null
        }
    }

    var cropComponentReady = function(){
        this.inputImage = $('#inputImage');
        this.image = $('#image'); 
        this.imageArea = $('#x-imageUploaderPreview');
        this.URL = window.URL || window.webkitURL;
        this.image.cropper(this.options);
        this.preview = $('#preview');
        this.spField = $('[title="'+this.campo+'"]');
    }

    var cropComponentMethods = {
        onCropImage:function () {
            this.result = this.image.cropper(this.method);
            this.ImageBase64 = this.result.toDataURL('image/png')
            this.imageArea.addClass(this.hiddenClass)
            if(this.spField){
                this.spField.val(this.ImageBase64)
            }
        },
        onImageChange:function (event) {
            var files = event.target.files;
            var file;
            if (!this.image.data('cropper')) {
                return;
            }
            if (files && files.length) {
                file = files[0];
                if (/^image\/\w+$/.test(file.type)) {
                    blobURL = this.URL.createObjectURL(file);
                    this.image.one('built.cropper', function () {
                        this.URL.revokeObjectURL(blobURL);
                    }.bind(this))
                    .cropper('reset')
                    .cropper('replace', blobURL);
                    this.inputImage.val('');
                    this.imageArea.removeClass(this.hiddenClass)
                    this.ImageBase64 = null;
                } else {
                    window.alert('Please choose an image file.');
                }
            }
        }
    }

    var cropComponentDefinition = {
        props: ['campo'],
        data: cropComponentData ,
        ready:cropComponentReady,
        methods:cropComponentMethods,
        template: ['<div id="sxCropComponent" class="container">',
                    '<input type="file" value="Escolher imagem" id="inputImage" v-on:change="onImageChange($event)" name="file" accept="image/*" />',
                    '<div id="x-imageUploaderPreview" class="ms-hidden">',                    
                            '<div class="img-container">',
                            '<img id="image" src="" alt="Picture" />',
                            '</div>',
                            '<div>',
                            '<button type="button" v-on:click="onCropImage($event)">Recortar</button>',
                            '</div>',
                        '</div>',
                        '<img id="preview" src="{{ImageBase64}}" alt="" v-if="ImageBase64">',
                    '</div>'].join('')
    }

    try{
        _spBodyOnLoadFunctions.push(initializeSxCropComponent)
    }catch(e){
        initializeSxCropComponent()
    }
    
})(Vue, jQuery)