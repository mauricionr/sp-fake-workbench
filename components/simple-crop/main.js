(function (Vue, $) {
    function initializeSxCropComponent() {
        var CropComponent = Vue.extend(cropComponentDefinition)
        Vue.component('sx-crop', CropComponent)
        new Vue({
            el: '#sx-crop'
        })
    }
    var cropComponentData = function () {
        return {
            showFileInput:true,
            image: null,
            notifications: [],
            inputImage: null,
            imageArea: null,
            blobURL: null,
            preview: null,
            options: {
                aspectRatio: 16 / 9
            },
            hiddenClass: 'ms-hidden',
            result: null,
            method: 'getCroppedCanvas',
            ImageBase64: null,
            spField: null
        }
    }

    var cropComponentReady = function () {
        if (!this.lista || !this.campo) {
            throw new Error('Atributos faltando')
        }
        this.inputImage = $('#inputImage');
        this.image = $('#image');
        this.imageArea = $('#x-imageUploaderPreview');
        this.URL = window.URL || window.webkitURL;
        this.image.cropper(this.options);
        this.preview = $('#preview');
        this.spField = $('[title="' + this.campo + '"]');
    }

    var cropComponentMethods = {
        uploadFile: function (content, fileName, library) {
            this.notify('Salvando ' + fileName)
            var url = [_spPageContextInfo.webAbsoluteUrl, "/_api/web/lists/getbytitle('", library, "')/rootfolder/files/add(url='", fileName, "', overwrite=false)"].join('');
            return $.ajax({
                url: url,
                type: "POST",
                data: content,
                processData: false,
                headers: {
                    Accept: "application/json;odata=verbose",
                    "X-RequestDigest": document.getElementById("__REQUESTDIGEST").value,
                    "Content-Length": content.byteLength
                }
            });
        },
        notify: function (message) {
            this.notifications.push(SP.UI.Notify.addNotification(message))
        },
        removeNotifications: function () {
            this.notifications.forEach(function (notification) {
                SP.UI.Notify.removeNotification(notification);
            });
        },
        thenUpload: function (response) {
            this.notify('Imagem salva com sucesso')
            this.spField.val(response.d.ServerRelativeUrl)
        },
        alwaysUpload: function () {
            setTimeout(function () {
                this.removeNotifications()
            }.bind(this), 1000)
        },
        catchUpload: function (error) {
            this.notify('Algo deu errado, Tentando novamente...')
            console.log(Error(error))
            this.fileName = [this.genGUID(), this.fileName].join('');
            this.upload(this.result);

        },
        upload: function (result) {
            this.result = result;
            return this.uploadFile(result, this.fileName, this.lista)
                .done(this.thenUpload.bind(this))
                .always(this.alwaysUpload.bind(this))
                .fail(this.catchUpload.bind(this))
        },
        genGUID: function () {
            var d = new Date().getTime();
            var guid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
                let r = (d + Math.random() * 16) % 16 | 0;
                d = Math.floor(d / 16);
                return (c === "x" ? r : (r & 0x3 | 0x8)).toString(16);
            });
            return guid;
        },
        readImage: function (file) {
            var deferred = $.Deferred()
            var reader = new FileReader();

            reader.onload = function (result) {
                this.upload.call(this, result.target.result, this.fileName).then(deferred.resolve)
            }.bind(this);

            reader.readAsArrayBuffer(file);

            return deferred.promise();
        },
        onCropImage: function () {
            if(!confirm('Tem certeza que deseja recortar esta imagem?'))return;

            this.showFileInput = false;
            this.result = this.image.cropper(this.method);
            this.imageArea.addClass(this.hiddenClass)
            if (this.spField) {
                this.ImageBase64 = this.result.toDataURL()
                this.result.toBlob(function (blobContent) {
                    this.readImage(blobContent);
                }.bind(this), 'image/png')
            }
        },
        onImageChange: function (event) {
            var files = event.target.files;
            var file;
            if (!this.image.data('cropper')) {
                return;
            }
            if (files && files.length) {
                file = files[0];
                this.fileName = file.name
                if (/^image\/\w+$/.test(file.type)) {
                    blobURL = this.URL.createObjectURL(file);
                    this.image
                        .one('built.cropper', function () {
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
        props: ['campo', 'lista'],
        data: cropComponentData,
        ready: cropComponentReady,
        methods: cropComponentMethods,
        template: ['<div id="sxCropComponent" class="container">',
            '<input type="file" value="Escolher imagem" id="inputImage" v-if="showFileInput" v-on:change="onImageChange($event)" name="file" accept="image/*" />',
            '<div id="x-imageUploaderPreview" class="ms-hidden">',
            '<div>',
            '<button type="button" v-on:click="onCropImage($event)">Recortar</button>',
            '</div>',
            '<div class="img-container">',
            '<img id="image" src="" alt="Picture" />',
            '</div>',
            '</div>',
            '<img id="preview" src="{{ImageBase64}}" alt="" v-if="ImageBase64">',
            '</div>'].join('')
    }

    try {
        _spBodyOnLoadFunctions.push(initializeSxCropComponent)
    } catch (e) {
        initializeSxCropComponent()
    }

})(Vue, jQuery) 