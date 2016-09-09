<%@ Assembly Name="Microsoft.SharePoint, Version=16.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c"%> <%@ Page Language="C#" Inherits="Microsoft.SharePoint.WebPartPages.WikiEditPage" MasterPageFile="~masterurl/default.master"      MainContentID="PlaceHolderMain" meta:progid="SharePoint.WebPartPage.Document" meta:webpartpageexpansion="full" %>
<%@ Import Namespace="Microsoft.SharePoint.WebPartPages" %> <%@ Register Tagprefix="SharePoint" Namespace="Microsoft.SharePoint.WebControls" Assembly="Microsoft.SharePoint, Version=16.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %> <%@ Register Tagprefix="Utilities" Namespace="Microsoft.SharePoint.Utilities" Assembly="Microsoft.SharePoint, Version=16.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %> <%@ Import Namespace="Microsoft.SharePoint" %> <%@ Assembly Name="Microsoft.Web.CommandUI, Version=16.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register Tagprefix="WebPartPages" Namespace="Microsoft.SharePoint.WebPartPages" Assembly="Microsoft.SharePoint, Version=16.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<asp:Content ContentPlaceHolderId="PlaceHolderAdditionalPageHead" runat="server">
<link rel="stylesheet" href="cropper.min.css">
<script type="text/javascript" src="//cdnjs.cloudflare.com/ajax/libs/vue/1.0.26/vue.min.js"></script>
<script src="//code.jquery.com/jquery-3.1.0.min.js" integrity="sha256-cCueBR6CsyA4/9szpPfrX3s49M9vUU5BgtiJj06wt/s=" crossorigin="anonymous"></script>
<script src="cropper.min.js"></script>
<script src="main.js"></script>
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
  methods:{}
})

</script>
</asp:Content>
