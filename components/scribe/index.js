(function ($, Vue) {

    new Vue({
        el: '#scribe-app',
        data: function () {
            return {
                cnpj: null,
                loading:false,
                cnpjNumber: '85.782.878/0001-89'
            }
        },
        created: function () {
            this.getCNPJ();
        },
        methods: {
            getCNPJInfo: function getCNPJInfo(cnpj) {
                return $.ajax({
                    url: 'https://endpoint.scribesoft.com/v1/orgs/5698/requests/2199?accesstoken=1681b179-53e5-4638-9b0c-22846f88ccf5',
                    method: 'POST',
                    data: { CNPJ: cnpj },
                    headers: {
                        Accept: 'application/json'
                    }
                })
            },
            getCNPJ: function () {
                Vue.set(this, 'loading', true)
                return this.getCNPJInfo(this.cnpjNumber)
                        .then(this.resolveCNPJ.bind(this))
            },
            resolveCNPJ:function (response) {
                Vue.set(this, 'loading', !this.loading)
                Vue.set(this, 'cnpj', JSON.stringify(response.data[0]));
            }
        },
        template: `
            <section>
                <p>
                    <input type="text" v-model="cnpjNumber" />
                    <input type="button" v-on:click="getCNPJ()" value="Buscar CNPJ"  />
                </p>
                <p v-if="loading">Loading....</p>
                <p v-if="!loading">
                    <code>
                        {{cnpj}}
                    </code>
                </p>
            </section>
        `
    })

})(jQuery, Vue)