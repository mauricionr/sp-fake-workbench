<%@ Reference VirtualPath="~masterurl/custom.master" %>
<%@ Page language="C#"   Inherits="Microsoft.SharePoint.Publishing.PublishingLayoutPage,Microsoft.SharePoint.Publishing,Version=15.0.0.0,Culture=neutral,PublicKeyToken=71e9bce111e9429c" meta:progid="SharePoint.WebPartPage.Document" meta:webpartpageexpansion="full" %>
<%@ Register Tagprefix="SharePointWebControls" Namespace="Microsoft.SharePoint.WebControls" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %> <%@ Register Tagprefix="WebPartPages" Namespace="Microsoft.SharePoint.WebPartPages" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %> <%@ Register Tagprefix="PublishingWebControls" Namespace="Microsoft.SharePoint.Publishing.WebControls" Assembly="Microsoft.SharePoint.Publishing, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %> <%@ Register Tagprefix="PublishingNavigation" Namespace="Microsoft.SharePoint.Publishing.Navigation" Assembly="Microsoft.SharePoint.Publishing, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<asp:Content ContentPlaceholderID="PlaceHolderPageTitle" runat="server">
	<SharePointWebControls:FieldValue id="PageTitle" FieldName="Title" runat="server"/>
</asp:Content>

<asp:Content ContentPlaceHolderID="PlaceHolderAdditionalPageHead" runat="server">
</asp:Content>

<asp:Content ContentPlaceholderID="PlaceHolderMain" runat="server">
<WebPartPages:SPProxyWebPartManager runat="server" id="spproxywebpartmanager"></WebPartPages:SPProxyWebPartManager>
<WebPartPages:WebPartZone id="g_03C07D1B4FFD44C2930135909D5BAD0A" runat="server" title="Content"><ZoneTemplate>
</ZoneTemplate></WebPartPages:WebPartZone>

<div id="contato">

    <h2>Cadastro Contatos</h2>
    <div class="form">
        <h3>Dados Básicos</h3>
        <table width="100%" cellpadding="0" cellspacing="0" border="0" id="dados-basicos">
            <tr>
                <td width="200">Nome Completo</td>
                <td><input type="text" id="nome_completo" /></td>
            </tr>
            <tr>
                <td>Nome para correspondência</td>
                <td><input type="text" id="nome_correspondencia" /></td>
            </tr>
            <tr>
                <td>Sigla PNA</td>
                <td><input type="text" id="sigla_pna" /></td>
            </tr>
            <tr>
                <td>Nacionalidade</td>
                <td>
                    <filled-dropdown method-name="proc_getPais" store-key="paises" model="Store.cadastroCRM" property="paises"></filled-dropdown>
                </td>
            </tr>
            <tr>
                <td>Se brasileira, CPF</td>
                <td><input type="text" id="CPF" name="cpf" /></td>
            </tr>
            <tr>
                <td>Masc/Fem</td>
                <td></td>
            </tr>
            <tr>
                <td>Idioma Principal</td>
                <td>
                    <filled-dropdown method-name="proc_getIdioma" store-key="idiomas" model="Store.cadastroCRM" property="idioma"></filled-dropdown>
                </td>
            </tr>
            <tr>
                <td>Idioma para correspondência</td>
                <td>
                    <select id="idioma_preferencia">
					<option selected="selected">Idiomas de Preferência</option>
				</select>
                </td>
            </tr>
            <tr>
                <td>Tratamento</td>
                <td>
                    <select id="tratamento">
					<option selected="selected">Formas de Tratamento</option>
				</select>
                </td>
            </tr>
            <tr>
                <td>Sufixo</td>
                <td>
                    <select id="sufixos">
					<option selected="selected">Sufixos</option>
				</select>
                </td>
            </tr>
            <tr>
                <td>Aniversário</td>
                <td><input type="text" id="data_aniversario" name="data" /></td>
            </tr>
            <tr>
                <td>Categoria de PF</td>
                <td>
                    <select id="categoria_pf">
					<option selected="selected">Categoria de PF</option>
				</select>
                </td>
            </tr>
            <tr>
                <td>Contato de Departamento responsável</td>
                <td>
                    <select id="departamento_responsavel">
					<option selected="selected">Departamentos</option>
				</select>
                </td>
            </tr>
        </table>
        <div class="buttons-session">
            <input type="button" value="Editar" id="editar_item" />
            <input type="button" value="Salvar" id="savar_item" />
            <input type="button" value="Excluir" id="excluir_item" />
        </div>
    </div>

    <div class="form">
        <h3>Dados Particulares</h3>
        <table width="100%" cellpadding="0" cellspacing="0" border="0" id="dados_particulares">
            <tr>
                <td>Pais</td>
                <td>
                    <filled-dropdown method-name="proc_getPais" store-key="paises" model="Store.cadastroCRM" property="paises"></filled-dropdown>
                </td>
            </tr>
            <tr>
                <td>UF</td>
                <td>
                    <select id="uf">
					<option selected="selected">Selecione um estado</option>
				</select>
                </td>
            </tr>
            <tr>
                <td>Cidade</td>
                <td></td>
            </tr>
            <tr>
                <td>Endereço - Linha 1</td>
                <td colspan="2"><input type="text" id="endereco_linha1" /></td>
                <td></td>
                <td><a class="add" href="" title="Adicionar mais">[+] Adicionar</a></td>
            </tr>
            <tr>
                <td>Código Postal</td>
                <td><input type="text" id="CEP" name="cep" /></td>
            </tr>
            <tr>
                <td>Telefone Fixo </td>
                <td><input type="text" id="telefone1" name="telefone" /></td>
                <td class="menor">Nome: <input type="text" id="nome_telefone1" /></td>
                <td>Principal? <input type="radio" id="tel_principal1" /> S <input type="radio" id="tel_principal1" /> N</td>
                <td><a class="add" href="" title="Adicionar mais">[+] Adicionar</a></td>
            </tr>
            <tr>
                <td>E-mail</td>
                <td><input type="text" id="email" name="email" /></td>
                <td class="menor">Nome: <input type="text" id="nome_email" /></td>
                <td>Principal? <input type="radio" name="email_principal1" /> S <input type="radio" name="email_principal1" />                    N</td>
                <td><a class="add" href="" title="Adicionar mais">[+] Adicionar</a></td>
            </tr>
            <tr>
                <td>Cônjuge</td>
                <td><input type="text" id="nome_conjuge" /></td>
                <td class="menor">D/N: <input type="text" id="data_nascimento_conjuge" name="data" /></td>
            </tr>
            <tr>
                <td>Filhos</td>
                <td><input type="text" id="filho" /></td>
                <td class="menor">D/N: <input type="text" id="data_nascimento_filho" name="data" /></td>
                <td></td>
                <td><a class="add" href="" title="Adicionar mais">[+] Adicionar</a></td>
            </tr>
            <tr>
                <td>Comentário</td>
                <td><input type="text" id="comentario" /></td>
            </tr>
        </table>
        <div class="buttons-session">
            <input type="button" value="Editar" id="editar_item" />
            <input type="button" value="Salvar" id="savar_item" />
            <input type="button" value="Excluir" id="excluir_item" />
        </div>
    </div>

    <div class="form">
        <h3>Dados Profissionais - PJ Principal</h3>
        <table width="100%" cellpadding="0" cellspacing="0" border="0" id="dados_profissionais">
            <tr>
                <td>Razão Social</td>
                <td>
                    <select id="empresas">
					<option selected="selected">Selecione uma Empresa</option>
				</select>
                </td>
            </tr>
            <tr>
                <td>Categoria da PJ</td>
                <td><input type="text" disabled="disabled" id="categoria_pj" value="A" /></td>
            </tr>
            <tr>
                <td>Categoria do Relacionamento</td>
                <td><input type="text" disabled="disabled" id="categoria_relacionamento" value="Terceiro" /></td>
            </tr>
            <tr>
                <td>Cargo</td>
                <td><input type="text" id="cargo" /></td>
            </tr>
            <tr>
                <td>Cargo padronizado PNA</td>
                <td>
                    <select id="cargo_padronizado">
					<option selected="selected">Cargos Padronizados</option>
				</select>
                </td>
            </tr>
            <tr>
                <td>Telefone</td>
                <td><input type="text" id="telefone_comercial1" name="telefone" /></td>
                <td class="menor">Nome: <input type="text" id="nome_telefone_comercial1" /></td>
                <td>Principal? <input type="radio" name="tel_principal1" /> S <input type="radio" name="tel_principal1" /> N</td>
                <td><a class="add" href="" title="Adicionar mais">[+] Adicionar</a></td>
            </tr>

            <tr class="email">
                <td>E-mail Comercial</td>
                <td><input type="text" id="email_comercial" name="email" /></td>
                <td class="menor">Nome: <input type="text" id="nome_email" /></td>
                <td>Principal? <input type="radio" name="email_comercial_principal" /> S <input type="radio" name="email_comercial_principal"
                    /> N</td>
                <td><a class="add" href="" title="Adicionar mais">[+] Adicionar</a></td>
            </tr>
            <tr>
                <td>Endereço Comercial</td>
                <td>
                    <select id="endereco_comercial">
					<option selected="selected">Selecione um endereço</option>
				</select>
                </td>
            </tr>
            <tr>
                <td>Observação</td>
                <td><input type="text" id="obs_empresa" /></td>
            </tr>
            <tr>
                <td>Ano de Entrada</td>
                <td><input type="text" id="ano_entrada" /></td>
            </tr>
            <tr>
                <td>Ano de Saída</td>
                <td><input type="text" id="ano_saida" /></td>
            </tr>
        </table>
        <div class="buttons-session">
            <input type="button" value="Editar" id="editar_item" />
            <input type="button" value="Salvar" id="savar_item" />
            <input type="button" value="Excluir" id="excluir_item" />
        </div>
    </div>
    <a href="javascript:" onclick="addRegistroProf($(this))" class="bt-right">[+] Adicionar novo registro</a>
    <div class="form" id="add_registro_profissional">
        <h3>Novo Registro Profissional</h3>
        <table width="100%" cellpadding="0" cellspacing="0" border="0" id="dados_profissionais_anteriores">
            <tr>
                <td>Nome da PJ</td>
                <td>Look up ou Livre*</td>
            </tr>
            <tr>
                <td>Categoria da PJ</td>
                <td><input type="text" disabled="disabled" id="categoria_pj_registro" value="B" /></td>
            </tr>
            <tr>
                <td>Cargo</td>
                <td><input type="text" id="cargo_" /></td>
            </tr>
            <tr>
                <td>Ano de Entrada</td>
                <td><input type="text" id="ano_entrada" /></td>
            </tr>
            <tr>
                <td>Ano de Saída</td>
                <td><input type="text" id="ano_saida" /></td>
            </tr>
        </table>
        <div class="buttons-session">
            <input type="button" value="Editar" id="editar_item" />
            <input type="button" value="Salvar" id="savar_item" />
            <input type="button" value="Excluir" id="excluir_item" />
        </div>
    </div>
    <div class="buttons">
        <input type="button" value="Enviar" />
    </div>
</div>
<script type="text/javascript" src="/style library/js/vue.js"></script>
<script type="text/javascript" src="/style library/js/store.js"></script>
<script type="text/javascript" src="/style library/js/filldropdown.js"></script>
<script type="text/javascript" src="/style library/js/contatos.forms.js"></script>
</asp:Content>
