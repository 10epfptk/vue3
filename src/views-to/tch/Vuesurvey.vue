<template>
    <div class="content">
        <p class="Location">
            <a href="../dashboard/dashboard.do" class="btn_set home">메인으로</a> <span
                class="btn_nav bold">커뮤니티</span> <span class="btn_nav bold">설문조사 관리</span> 
        </p>
        
        <p class="conTitle">
            <span>설문조사 관리</span> 
            <span class="fr"></span>
            
        </p>
        <!-- 강의 목록 출력 -->
        <div id="lecListArea">
            
            <div id="tDetailist">
                
                <table class="col">
                    <caption>caption</caption>
                    <colgroup>
                        <col width="20%">
                        <col width="20%">
                        <col width="20%">
                        <col width="20%">
                        <col width="20%">
                    </colgroup>

                    <thead>
                        <tr>
                            <th scope="col">과목</th>
                            <th scope="col">강사명</th>
                            <th scope="col">강의 시작일</th>
                            <th scope="col">강의 종료일</th>
                            <th scope="col">설문인원/수강인원</th>
                        </tr>
                    </thead>
                    
                    <template v-if="lectotalCnt == 0">
                            <tbody>
                                <td colspan="5">데이터가 존재하지 않습니다.</td>
                            </tbody>
                        </template>
                        
                        <template v-else>
                            <tbody v-for=" list in lecList" :key="list.lec_seq">
                                <tr>
                                    <td><a href="" @click.prevent="drawdatasel(list.lec_seq)">{{list.lec_name}}</a></td>
                                    <td>{{list.name}}</td>
                                    <td>{{list.lec_st}}</td>
                                    <td>{{list.lec_ed}}</td>
                                    <td>{{list.sendq}}/{{list.lec_now}}</td>
                                </tr>
                            </tbody>
                        </template>
                </table>

                <div id="lecPagination">
                    <Paginate
                        class="justify-content-center"
                        v-model="currentPage"   
                        :page-count="totalPage"
                        :page-range="5"
                        :margin-pages="0"
                        :click-handler="tDetailList"
                        :prev-text="'Prev'"
                        :next-text="'Next'"
                        :container-class="'pagination'"
                        :page-class="'page-item'"
                    >
                    </Paginate>
           </div>
            </div>

        </div>
        <br>
<!-- 설문조사 그래프 영역 -->                        
            <div id="graphArea">
                <select @change="drawdatasel()" v-model="selQueSeq" v-show="graphShow" style="width: 150px; float:right;" >
                    <option v-for="num in 10" :value="num" :key="num">{{num}}번 문항</option>
                </select>
                <br>
            </div>    
                <div v-show="graph">
                   <h5 style="font-size: 17px; font-family: Roboto; color: rgb(117, 117, 117);">{{cnt}}번 문항</h5>
                  &nbsp;<p style="font-family: Roboto; font-size: 14px; color: rgb(189, 189, 189)">{{title}}</p>
                    <GChart type="ColumnChart"
                            :data="chartData"
                            :options="chartOptions" 
                    />    
                    <!-- 그래프 나오는 공간 -->
                </div>
    </div> 
  
</template>

<script>
import Paginate from 'vuejs-paginate-next';
import { GChart } from "vue-google-charts"; // 구글차트 import

export default {
    data() {
        return {
            tchID          : "",
            lecseq         : 0,               
            lecList        : [],    // 과목리스트
            lectotalCnt    : 0,     // 과목 총 갯수
            currentPage    : 1,
            pageSize       : 5,
            pageBlockSize  : 10,
            totalPage      : 1,
            graphShow      : false, // select box
            graph          : false, // graph
            selQueSeq      : 1,
            chartData      : [],    // 차트에 출력 될 데이터
            chartOptions   : {},    // 차트 옵션
            title          : "",
            cnt            :  0,            
        }
    },
    mounted() {
        this.tDetailList();
    },
    methods: {
        tDetailList : function(){
            let params = new URLSearchParams();
            params.append('currentPage', this.currentPage);
            params.append('pageSize', this.pageSize);

            this.axios
            .post('/tch/vuetDetailList.do', params)
            .then((response) =>{
            console.log(response);
                this.lecList = response.data.tDetailList;
                this.lectotalCnt = response.data.tDetailCnt;
                this.totalPage = this.page(this.lectotalCnt, this.pageSize); 
            })
            .catch(function (error) {
                 alert('에러! API 요청에 오류가 있습니다. ' + error);
            });

        }, //  end of tDetailList

        drawdatasel: function(lec_seq){
            // 셀렉트 박스 클릭(파라미터 없는 메소드) => 이전에 저장 된 lec_seq 저장
            if(lec_seq == undefined || lec_seq ==''){
                this.lecseq = this.lecseq;
                console.log("lec_seq 없는경우");
            // 과목명 클릭 시 => lec_seq 존재 => 클릭한 번호 저장     
             }else{ 
                this.lecseq = lec_seq;
                console.log("lec_seq 있는경우");
             }
             // 선택한 과목 코드
            this.graphShow = true;  // select box 선택한 문항
            
            let params = new URLSearchParams();
            params.append('queseq', this.selQueSeq);
            params.append('lecseq', this.lecseq);
            this.graph = true;
            this.axios
            .post('/tch/drawGraph.do', params)
            .then((response) =>{
                    console.log(response);
                    this.drawChart(response);
                })
                .catch(function (error) {
                    alert('요기 에러! API 요청에 오류가 있습니다. ' + error);
                });
        },  // end of drawdatasel

        drawChart: function(draw){  // select box change시, 해당하는 데이터 차트에 입력
            this.chartData = [  
                                ['만족도', Number(draw.data.drawdata[0].lec_name)+''],
                                ['매우 만족',Number(draw.data.drawdata[1].lec_name)],
                                ['만족',Number(draw.data.drawdata[2].lec_name)],
                                ['보통',Number(draw.data.drawdata[3].lec_name)],
                                ['불만',Number(draw.data.drawdata[4].lec_name)],
                                ['매우 불만',Number(draw.data.drawdata[5].lec_name)],
                            ];
                            
                            
            this.chartOptions = {   // 차트 사이즈 & 여백 옵션 지정
                height: 500,
                width:'100%',
                vAxis: { ticks: [0,0.2,0.4,0.6,0.8,1]
                        },         
                chartArea :{  // chart 여백 생성
                                left: 50, 
                                top: 50, 
                                right: 110, 
                                bottom: 50
                            } 
            };                
  
            this.title = draw.data.drawtitle; 
            this.cnt = draw.data.queseq;

        },  // end of drawChart

        page: function (total, page) {

            var xx = total % page;  
            var result = parseInt(total / page);

            if (xx == 0) {
                return result;
            } else {
                result = result + 1;
                return result;
            }
        },   // end of page

    },
    components: {
        Paginate: Paginate,
        GChart : GChart,
    },

}
</script>

<style>
</style>