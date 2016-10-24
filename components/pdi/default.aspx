
<%@ Assembly Name="Microsoft.SharePoint, Version=16.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c"%> <%@ Page Language="C#" Inherits="Microsoft.SharePoint.WebPartPages.WikiEditPage" MasterPageFile="~masterurl/default.master"      MainContentID="PlaceHolderMain" meta:progid="SharePoint.WebPartPage.Document" %>
<%@ Import Namespace="Microsoft.SharePoint.WebPartPages" %> <%@ Register Tagprefix="SharePoint" Namespace="Microsoft.SharePoint.WebControls" Assembly="Microsoft.SharePoint, Version=16.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %> <%@ Register Tagprefix="Utilities" Namespace="Microsoft.SharePoint.Utilities" Assembly="Microsoft.SharePoint, Version=16.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %> <%@ Import Namespace="Microsoft.SharePoint" %> <%@ Assembly Name="Microsoft.Web.CommandUI, Version=16.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register Tagprefix="WebPartPages" Namespace="Microsoft.SharePoint.WebPartPages" Assembly="Microsoft.SharePoint, Version=16.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<asp:Content ContentPlaceHolderId="PlaceHolderAdditionalPageHead" runat="server">

</asp:Content>

<asp:Content ContentPlaceHolderId="PlaceHolderMain" runat="server">
    <section id="app">
         <h4>Relatorio de PDI</h4>
        <div v-if="loading">Loading...</div>
        <table v-cloak v-if="!loading">
            <tr v-if="data.length === 0">
                <td colspan="3">Nenhum item encontrado</td>
            </tr>
            <tr v-for="item in data">
                <td>PDI {{item.Id}}</td>
                <td>
                    <table>
                        <tr v-for="meta in item.Metas">
                            <td>Meta do PDI {{meta.PDIId}}</td>
                        </tr>
                    </table>
                </td>
                <td>
                        <table>
                        <tr v-for="revisao in item.Revisoes">
                            <td>Revisao do PDI {{revisao.PDIId}}</td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    </section>
    <script src="vue.js"></script>
    <script src="pnp.min.js"></script>
    <script src="main.js"></script>
</asp:Content>
