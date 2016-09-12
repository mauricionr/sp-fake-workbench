(function($){
    var fileInpuId = '#inputImage';
    var uploadButton = '#uploadImage';
    var uploadStatus = '#uploadStatus';
    var library = 'CompartilheImages';
    var hiddenClass = 'ms-hidden'
    
     $(function(){
	 	var file;
	 	if (!window.FileReader) {
	        alert("This browser does not support the HTML5 File APIs");
	        $(fileInpuId).parent().remove();
	        return;
	    }
	    
	    $(fileInpuId).on('change', function(){
	    	file = this.files[0]
	    	$(uploadButton).removeClass(hiddenClass)
	    })
	    $(uploadButton).on('click', function(){
	    	this.remove()
	    	$(fileInpuId).remove()
	    	imageService.readImage.call(imageService, file, file.name)
	    })
	 })
	 
	var imageService = {
		 createListItem: function(){
		 	debugger;
		 },
		 uploadFile :function(content, fileName, library){
		 	var url = [
				_spPageContextInfo.webAbsoluteUrl, 
				"/_api/web/lists/getbytitle('",
				library,
				"')/rootfolder/files/add(url='",
				fileName,
				"', overwrite=false)"
			].join('');
		 			
			return $.ajax({
		        url: url,
		        type: "POST",
		        data: content,
		        processData:false,
		        headers: {
		            Accept: "application/json;odata=verbose",
		            "X-RequestDigest": $("#__REQUESTDIGEST").val(),
		            "Content-Length": content.byteLength
		        }
		    });
		 },
		 upload:function(result, name){
		 	return this.uploadFile(result.target.result, name, library)
		    	.then(function(response){
		    		$('[title="ImageID"]').val(response.d.Name)
		    		$(uploadStatus).removeClass(hiddenClass).text('Imagem salva com sucesso')
		    	})
		    	.catch(function(error){
		    		this.upload(result, [this.genGUID(), name].join(''));
		    	}.bind(this))
		 },
		 readImage : function(file, name){
		 	var deferred = $.Deferred()
			var reader = new FileReader();
			
			reader.onload = function (result) {
			    this.upload(result, name)
			    	.then(deferred.resolve)
			    
			}.bind(this);
			reader.readAsArrayBuffer(file);
			return deferred.promise();
		 },
		 genGUID:function(){
		 	var d = new Date().getTime();
	        var guid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
	            let r = (d + Math.random() * 16) % 16 | 0;
	            d = Math.floor(d / 16);
	            return (c === "x" ? r : (r & 0x3 | 0x8)).toString(16);
	        });
	        return guid;
		 }
	}
})(jQuery)
