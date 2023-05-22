<template>
   <div>
      <div id="stuNameModal" class="layerType2" style="width: 600px; position: initial;">
         <dl>
            <dt>
               <strong>학생 정보</strong><a href="" class="closePop" v-on:click.prevent="close"><span class="hidden">닫기</span></a>
            </dt>
            <dd class="content">
               <table class="row">
                  <caption>caption</caption>
                  <colgroup>
                     <col width="100px">
                     <col width="*">
                     <col width="100px">
                     <col width="*">
                  </colgroup>
                  <tbody>
                     <tr>
                        <th scope="row">ID</th>
                           <!-- <td><input type="text" class="inputTxt p100" name="loginID3" id="loginID3" v-bind:readonly="loginID" /></td> -->
                           <!-- v-bind는 v-on과 유사하게 :[속성명]을 붙여서 사용하며, v-bind를 약어로 :(콜론)으로 줄여서 사용할 수 있습니다. / ex):value="loginID" -->
                           <td><input type="text" class="inputTxt p100" v-model="infoShow.loginID.value" name="loginID3" id="loginID3" readonly /></td>
                        <th scope="row">학번</th>
                           <td><input type="text" class="inputTxt p100" v-model="infoShow.stu_num.value" name="stu_num3" id="stu_num3" readonly /></td>
                     </tr>
                     <tr>
                        <th scope="row">이름</th>
                           <td><input type="text" class="inputTxt p100" v-model="infoShow.name.value" name="name3" id="name3" readonly /></td>
                        <th scope="row">전화번호 </th>
                           <td><input type="text" class="inputTxt p100" v-model="infoShow.hp.value" name="hp3" id="hp3" readonly /></td>
                     </tr>
                     <tr>
                        <th scope="row">이메일</th>
                           <td colspan="3"><input type="text" class="inputTxt p100" v-model="infoShow.email.value" name="email3" id="email3" readonly /></td>
                     </tr>
                  </tbody>
               </table>
               <br>
               <p class="conTitle"><span>수강 과목</span></p>
                     <div id="lec2">
                        <table class="col">
                           <caption>caption</caption>
                           <colgroup>
                              <col width="20%">
                              <col width="15%">
                              <col width="40%">
                              <col width="25%">
                           </colgroup>
                           <thead>
                              <tr>
                                 <th scope="col">강의명</th>
                                 <th scope="col">강사명</th>
                                 <th scope="col">기간</th>
                                 <th scope="col">상태</th>
                              </tr>
                           </thead>
                           <template v-if="jobInfo.totalCnt3 === 0">
                              <tbody id="tbodyjobListRegit2">
                                 <tr>
                                    <td colspan="4">수강중인 과목이 없습니다</td>
                                 </tr>
                              </tbody>
                           </template>
                           <template v-else>
                              <tbody id="tbodyjobListRegit2">
                                 <tr v-for="lec in jobInfo.jobRegitList2" :key="lec.lec_seq">
                                    <td>{{ lec.lec_name }}</td>
                                    <td>{{ lec.name }}</td>
                                    <td>{{ lec.lec_date }}</td>
                                    <td>{{ lec.lec_state }}</td>
                                 </tr>
                              </tbody>
                           </template>
                        </table>
                     </div>
            </dd>
         </dl>
      </div>
   </div>
</template>
<script>

import axios from "axios";
import { reactive, toRefs } from "vue";
import { closeModal } from 'jenesius-vue-modal';

export default {
   props: {
      infoShow2: {
         type: Object,
         required: true,
      }
   },
   setup(props) {
   
      // toRefs()는 ref를 여러번 해주는 함수입니다.
      // props의 reactivity가 없어지기 때문에 toRefs로 둘러싸고 변수에 넣습니다.
      // 컴포넌트가 반응형을 잃지 않고 분해 할당 및 확장 할 수 있어 유용합니다.
      const infoShow = toRefs(props.infoShow2);

      const jobInfo = reactive({
         jobRegitList2: [],
         totalCnt3: 0,
      })

      const params = new URLSearchParams();
      params.append('loginID', props.infoShow2.loginID);

      // 컨트롤러 수정했음 (JobController.java / VuejobListRegit2.do)
      axios.post('/admin/VuejobListRegit2.do', params)
      .then(response => {
         jobInfo.jobRegitList2 = response.data.jobRegitList2;
         jobInfo.totalCnt3 = response.data.totalCnt3;
      })

      function close() {
         closeModal();
      }

      return {
         jobInfo,
         close,
         infoShow,
      }
   }
};
</script>
<style>
   table:nth-child(1){display: table; margin: auto;}
</style>