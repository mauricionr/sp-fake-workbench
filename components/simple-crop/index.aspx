<%@ Assembly Name="Microsoft.SharePoint, Version=16.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c"%> <%@ Page Language="C#" Inherits="Microsoft.SharePoint.WebPartPages.WikiEditPage" MasterPageFile="~masterurl/default.master"      MainContentID="PlaceHolderMain" meta:progid="SharePoint.WebPartPage.Document" meta:webpartpageexpansion="full" %>
<%@ Import Namespace="Microsoft.SharePoint.WebPartPages" %> <%@ Register Tagprefix="SharePoint" Namespace="Microsoft.SharePoint.WebControls" Assembly="Microsoft.SharePoint, Version=16.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %> <%@ Register Tagprefix="Utilities" Namespace="Microsoft.SharePoint.Utilities" Assembly="Microsoft.SharePoint, Version=16.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %> <%@ Import Namespace="Microsoft.SharePoint" %> <%@ Assembly Name="Microsoft.Web.CommandUI, Version=16.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register Tagprefix="WebPartPages" Namespace="Microsoft.SharePoint.WebPartPages" Assembly="Microsoft.SharePoint, Version=16.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<asp:Content ContentPlaceHolderId="PlaceHolderAdditionalPageHead" runat="server">

</asp:Content>

<asp:Content ContentPlaceHolderId="PlaceHolderMain" runat="server">
<script type="text/javascript" src="//cdnjs.cloudflare.com/ajax/libs/vue/1.0.26/vue.min.js"></script>

<div id="app">
  <input v-model="newTodo" type="text"/>
  <input type="button" v-on:click="addTodo" value="Add" />  
  <ul>
    <li v-for="todo in todos">
      <span>{{ todo.text }}</span>
      <input type="button" v-on:click="removeTodo($index)" value="x"/>
    </li>
  </ul>
</div>


<script>

new Vue({
  el: '#app',
  data: {
    newTodo: '',
    todos: [
      { text: 'Add some todos vscode watching..' },
      { text: 'Add some todos vscode watching..' },
      { text: 'Add some todos vscode watching..' },
      { text: 'Add some todos vscode watching..' },
      { text: 'Add some todos vscode watching..' },
      { text: 'Add some todos vscode watching..' },
      { text: 'Add some todos vscode watching..' },
      { text: 'Add some todos vscode watching..' },
    ]
  },
  methods: {
    addTodo: function () {
      var text = this.newTodo.trim()
      if (text) {
        this.todos.push({ text: text })
        this.newTodo = ''
      }
    },
    removeTodo: function (index) {
      this.todos.splice(index, 1)
    }
  }
})

</script>
</asp:Content>
