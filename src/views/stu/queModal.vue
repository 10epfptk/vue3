<template>
    <div id="layer2" class="layerPop layerType2" style="width: 600px;">
      <dl>
        <dt>
            <strong>설문 조사</strong>
        </dt>

        <dd class="content">
            <div style="overflow:auto; width:550px; height:700px;">      
                <table class="col">
                    <thead>
                        <tr>
                            <th>과정명</th>
                            <th style="background-color: #FFFFFF;">{{lec_name}}</th>
                            <th>강사명</th>
                            <th style="background-color: #FFFFFF;">{{ui_name}}</th>
                        </tr>
                        <tr>
                            <th scope="row" colspan="4">설문 지문</th>
                        </tr>
                    </thead>

                    <tbody v-for="(list,index) in queList" :key="index">
                                <tr>
                                    <td colspan="4" style="text-align: left;">{{list.que_seq}}번. {{list.que_title}} </td>
                                </tr>
                                <tr>
                                    <td colspan="4" style="text-align: left;">
                                       <input type="radio" :name="index"  @click="setRadioValues($event, index)" value="1">{{list.que_one}}<br>
                                       <input type="radio" :name="index"  @click="setRadioValues($event, index)" value="2">{{list.que_two}}<br>
                                       <input type="radio" :name="index"  @click="setRadioValues($event, index)" value="3">{{list.que_three}}<br>
                                       <input type="radio" :name="index"  @click="setRadioValues($event, index)" value="4">{{list.que_four}}<br>
                                       <input type="radio" :name="index"  @click="setRadioValues($event, index)" value="5">{{list.que_five}}<br>
                                    </td>
                                </tr>
                    </tbody>
                </table>
            </div>


            <div class="btn_areaC mt30">
                <a href="" @click.prevent="quesendsave()" class="btnType blue" id="btnInsert" name="btn"><span>제출</span></a> 
                <a href=""   class="btnType gray"  id="btnClose" name="btn"><span>취소</span></a>

            </div>
        </dd>
   
   
    </dl>
    <a href="" class="closePop" @click.prevent="modalclose()"><span class="hidden">닫기</span></a>
      
   </div>
</template>
<script>

    import {closeModal} from 'jenesius-vue-modal';

    export default{

        props: {

            mlecseq : String,

        },

        data: function(){

            return{

                lecseq: '',
                queList: [],
                lec_name: '',
                ui_name: '',
                que0: '',
                que1: '',
                que2: '',
                que3: '',
                que4: '',
                que5: '',
                que6: '',
                que7: '',
                que8: '',
                que9: '',

            }

        },
        mounted(){

            this.lecseq = this.mlecseq;
            console.log(this.lecseq);
            this.survey();

        },
        methods: {

            modalclose: function(){

                closeModal(this);

            },
            survey: function(){

                let params = new URLSearchParams();

                params.append('lec_seq', this.lecseq);

                this.axios
                    .post('/stu/vuequeSelect.do', params)
                    .then((result) => {

                        this.queList = result.data.quelist;
                        this.lec_name = result.data.quehead.lec_name;
                        this.ui_name = result.data.quehead.ui_name;
                        console.log(this.lec_name);
                        console.log(this.ui_name);

                    })

            },
            setRadioValues: function(event, index){

                console.log(event.target.value);
                console.log(index);

                let queval = 'que' + index;
                this.$data[queval] = event.target.value;

            },
            quesendsave: function(){

                for(let i = 0; i < 10; i++){

                    let queseq = 'this.que' + i;
                    
                    if(eval(queseq) == ''){

                        console.log(eval(queseq));

                        this.$swal.fire({

                            title: i + 1 + '번 문항을 선택해 주세요.',
                            icon: 'error',
                            buttons: {
                                confirm: {
                                    text: '확인',
                                    value: true,
                                    className: 'btn btn-outline-primary'
                                }
                            }

                        })
                        return;

                    }

                }

                let params = new URLSearchParams();
                let datalist = [];
                let que_seq = [];

                for(let i = 0; i < 10; i++){

                    let data = 'this.que' + i;

                    datalist.push(eval(data));
                    que_seq.push(i + 1);

                }

                console.log(this.lecseq);
                console.log(datalist);
                console.log(que_seq);

                params.append('lec_seq', this.lecseq);
                params.append('datalist', datalist);
                params.append('que_seq', que_seq);

                this.axios
                    .post('/stu/quenpmSendSave.do', params)
                    .then(() => {

                        this.$swal.fire({

                            title: '등록되었습니다.',
                            icon: 'success',
                            buttons: {
                                confirm: {
                                    text: '확인',
                                    value: true,
                                    className: 'btn btn-outline-primary'
                                }
                            }

                        })
                        closeModal(this);

                    });

            }

        }

    }
</script>
<style>
    #layer2 table{display: table;}
    #layer2 thead tr:nth-child(1) th:nth-child(1), thead tr:nth-child(1) th:nth-child(3){width: 15%;}
    #layer2 thead tr:nth-child(1) th:nth-child(2), thead tr:nth-child(1) th:nth-child(4){width: 35%;}
</style>