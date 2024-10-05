<template>
    <div>
        <a-steps :current="current">
            <a-step v-for="item in steps" :key="item.title" :title="item.title" />
        </a-steps>
        <div class="steps-content">
            <KeepAlive>
                <Form1 ref="form1" v-if="steps[current].key == 1"/>
            </KeepAlive>
            <KeepAlive>
                <Form2 ref="form2" v-if="steps[current].key == 2" />
            </KeepAlive>
            <KeepAlive>
                <Form3 ref="form3" v-if="steps[current].key == 3" />
            </KeepAlive>
            <KeepAlive>
                <Form4 ref="form4" v-if="steps[current].key == 4" />
            </KeepAlive>
            <KeepAlive>
                <Form5 ref="form4" v-if="steps[current].key == 5" />
            </KeepAlive>
            <KeepAlive>
                <Form6 ref="form6" v-if="steps[current].key == 6" />
            </KeepAlive>
        </div>
        <div class="steps-action">
            <a-button v-if="current == steps.length - 1 && current != 5" type="primary"
                @click="message.success('Processing complete!')">
                Submit Form
            </a-button>
            <a-button v-if="current > 0 && current != 5" style="margin-left: 8px" @click="prev">Previous</a-button>
        </div>
    </div>
</template>
<script>
import { defineComponent, ref, onMounted } from 'vue';
import axios from 'axios';
import { message } from 'ant-design-vue';
import Form1 from '../../Pep/Form/StepsForm/DeclaracaoStep.vue'
import Form2 from '../../Pep/Form/StepsForm/DadosPessoaisStep.vue'
import Form3 from '../../Pep/Form/StepsForm/FontePatrimonioStep.vue'
import Form4 from '../../Pep/Form/StepsForm/EmpresasStep.vue'
import Form5 from '../../Pep/Form/StepsForm/PessoasStep.vue'
import Form6 from '../../Pep/Form/StepsForm/DoneStep.vue'
import EventBus from '@/Helpers/event-bus';
import Cookies from 'js-cookie'
export default defineComponent({
    components: {
        Form1, Form2, Form3, Form4, Form5, Form6
    },
    setup() {
        const form1 = ref();
        const form2 = ref();
        const form3 = ref();
        const form4 = ref();
        const form5 = ref();
        const form6 = ref();
        const current = ref(0);
        const next = () => {
            current.value++;
        };
        const prev = () => {
            current.value--;
        };
        onMounted(() => {
            EventBus.$on("next-form", () => {
                next()
            });
            EventBus.$on("next-form-6", () => {
                current.value = 5
            });
            EventBus.$on("submit-form", () => {
                prepar()
            });

        });
        const prepar = () =>{
            var form1 = JSON.parse(Cookies.get('form1'))
            var form2 = JSON.parse(Cookies.get('form2'))
            var form3 = JSON.parse(Cookies.get('form3'))
            var form4 = JSON.parse(Cookies.get('form4'))
            var form5 = JSON.parse(Cookies.get('form5'))
            var values = { 'form1': form1, 'form2': form2, 'form3': form3, 'form4': form4, 'form5': form5 }
            console.log('sent to server')
            send(values)

        }

        function send(values ) {
            axios.post("v1/peps-form", values)
                .then(
                    response => {
                        if (!response.data.errors) {
                            Cookies.remove('form1')
                            Cookies.remove('form2')
                            Cookies.remove('form3')
                            Cookies.remove('form4')
                            Cookies.remove('form5')
                        }
                    }
                )
        }

       


        return {
            form1,
            form2,
            form3,
            form4,
            form5,
            form6,
            message,
            current,
            steps: [{
                title: 'DECLARAÇÃO',
                key: 1,
            }, {
                title: 'DADOS PESSOAIS',
                key: 2,
            }, {
                title: 'FONTE DE PATRIMÓNIO',
                key: 3,
            }, {
                title: 'EMPRESAS',
                key: 4,
            }, {
                title: 'RELAÇÕES',
                key: 5,
            }, {
                title: 'FIM',
                key: 6,
            }],
            next,
            prev,
        };
    },
});
</script>
<style scoped>
.steps-content {
    margin-top: 16px;
    border: 1px dashed #e9e9e9;
    border-radius: 6px;
    background-color: #fafafa;
    min-height: 200px;
    text-align: left;
    padding-top: 80px;
    padding-left: 80px;
    margin-left: 16px;
    padding-right: 80px;
    margin-right: 16px;
}

.steps-action {
    margin-top: 24px;
}

[data-theme='dark'] .steps-content {
    background-color: #2f2f2f;
    border: 1px dashed #404040;
}
</style>
