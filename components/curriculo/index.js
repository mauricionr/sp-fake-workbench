(function (Vue, pnp, $) {

    var Buscador = new Vue({
        created: function () {

        },
        template: [
            '<section>',
            '<h3>Procurar por nome</h3>',
            '<ul class="alfabeto" data-key="cgvfAdvPL:" data-tag="a">',
            '<li><a href="">A</a></li>',
            '<li><a href="">B</a></li>',
            '<li><a href="">C</a></li>',
            '<li><a href="">D</a></li>',
            '<li><a href="">E</a></li>',
            '<li><a href="">F</a></li>',
            '<li><a href="">G</a></li>',
            '<li><a href="">H</a></li>',
            '<li><a href="">I</a></li>',
            '<li><a href="">J</a></li>',
            '<li><a href="">K</a></li>',
            '<li><a href="">L</a></li>',
            '<li><a href="">M</a></li>',
            '<li><a href="">N</a></li>',
            '<li><a href="">O</a></li>',
            '<li><a href="">P</a></li>',
            '<li><a href="">Q</a></li>',
            '<li><a href="">R</a></li>',
            '<li><a href="">S</a></li>',
            '<li><a href="">T</a></li>',
            '<li><a href="">U</a></li>',
            '<li><a href="">V</a></li>',
            '<li><a href="">W</a></li>',
            '<li><a href="">X</a></li>',
            '<li><a href="">Y</a></li>',
            '<li><a href="">Z</a></li>',
            '</ul>',
            '<hr />',
            '<div>',
            '<input id="quemVoceProcura" data-key="cgvfAdvFullName:" data-tag="input" class="icon" placeholder="Quem você procura? "/><i class="lupa"></i>',
            '</div>',
            '<ul class="menu-list" id="opcoes-busca">',
            '<li>',
            '<select id="areaatuacao" data-key="cgvfAdvAtuacao" data-tag="select">',
            '<option value="0" selected>Área de Atuação</option>',
            '</select>',
            '</li>',
            '<li>',
            '<select id="filial" data-key="cgvfAdvEscritorio:" data-tag="select">',
            '<option value="0" selected>Filial</option>',
            '</select>',
            '</li>',
            '<li>',
            '<input type="button" value="Buscar" id="buscaProfissional"/>',
            '</li>',
            '</ul>',
            '<div>',
            '<input id="clearSearch" type="button" value="Limpar pesquisa"/>',
            '</div>',
            '</section>'
        ].join('')
    })

    new Vue({
        el:'#busca-profissional',
        components:{
            buscador:Buscador
        }
    })

})(Vue, $pnp, jQuery)