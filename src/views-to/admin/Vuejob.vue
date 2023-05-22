<template>
  <div>
    <p class="Location">
      <a href="../dashboard/dashboard.do" class="btn_set home">메인으로</a>
      <span class="btn_nav bold">취업관리</span>
      <span class="btn_nav bold">취업 정보</span>
    </p>

    <br />
    <!--// content -->
    <p class="conTitle" id="searcharea">
      <span>취업 정보 등록</span>
      <span class="fr">
        학생명:<input
          type="text"
          style="width: 150px; height: 30px"
          v-model="regInfo.searchStuName"
          id="searchStuName"
          name="searchStuName"
          v-on:keyup.enter="reglist(1)"
        />
        <a
          href=""
          class="btnType blue"
          id="searchbtn"
          name="searchbtn"
          v-on:click.prevent="reglist(1)"
          ><span>검 색</span></a
        >
      </span>
    </p>
    <div id="jobRegitList">
      <div>
        <table class="col">
          <caption>
            caption
          </caption>
          <colgroup>
            <col width="10%" />
            <col width="15%" />
            <col width="30%" />
            <col width="30%" />
            <col width="15%" />
          </colgroup>

          <thead>
            <tr>
              <th scope="col">학번</th>
              <th scope="col">학생명</th>
              <th scope="col">연락처</th>
              <th scope="col">이메일</th>
              <th scope="col">취업등록</th>
            </tr>
          </thead>

          <template v-if="regInfo.totalCnt2 === 0">
            <tbody>
              <tr>
                <td colspan="5">조회된 데이터가 없습니다.</td>
              </tr>
            </tbody>
          </template>
          <template v-else>
            <tbody v-for="(item, index) in regInfo.jobRegitList" :key="index">
              <tr v-on:click="showInfo(item.loginID)">
                <!-- 번호받아서 '학생 정보 팝업(취업 정보에 학생 이름 클릭)' md_showInfo 함수로 전달 -->
                <td>{{ item.stu_num }}</td>
                <td>{{ item.name }}</td>
                <td>{{ item.hp }}</td>
                <td>{{ item.email }}</td>
                <!-- <td>{{item.job_state}}</td> -->
                <td>
                  <a
                    v-on:click.stop="regJob(item.loginID)"
                    id="modalView"
                    class="btnType3 color1"
                    ><span>등록</span></a
                  >
                </td>
              </tr>
            </tbody>
          </template>
        </table>
      </div>
      <div id="regPagination">
        <Paginate
          class="justify-content-center"
          v-model="regInfo.pageNum"
          :page-count="regInfo.totalpage"
          :page-range="5"
          :margin-pages="0"
          :click-handler="reglist"
          :prev-text="'Prev'"
          :next-text="'Next'"
          :container-class="'pagination'"
          :page-class="'page-item'"
        />
      </div>
    </div>

    <br />
    <p class="conTitle">
      <span>취업 정보</span>
    </p>
    <div id="jobInfoList">
      <table class="col">
        <caption>
          caption
        </caption>
        <colgroup>
          <col width="10%" />
          <col width="15%" />
          <col width="30%" />
          <col width="15%" />
          <col width="15%" />
        </colgroup>

        <thead>
          <tr>
            <th scope="col">학번</th>
            <th scope="col">학생명</th>
            <th scope="col">연락처</th>
            <th scope="col">회사명</th>
            <th scope="col">취업여부</th>
          </tr>
        </thead>

        <template v-if="jobInfo.totalCnt === 0">
          <tbody>
            <tr>
              <td colspan="5">조회된 데이터가 없습니다.</td>
            </tr>
          </tbody>
        </template>
        <template v-else>
          <tbody v-for="(item, index) in jobInfo.jobList" :key="index">
            <tr>
              <!-- 번호받아서 '등록 버튼 md_updateInfo' 함수로 전달 -->
              <td>{{ item.stu_num }}</td>
              <td>{{ item.name }}</td>
              <td>{{ item.hp }}</td>
              <td>{{ item.job_company }}</td>
              <td>{{ item.job_state }}</td>
            </tr>
          </tbody>
        </template>
      </table>
    </div>
    <div id="jobPagination">
      <Paginate
        class="justify-content-center"
        v-model="jobInfo.pageNum"
        :page-count="jobInfo.totalpage"
        :page-range="5"
        :margin-pages="0"
        :click-handler="joblist"
        :prev-text="'Prev'"
        :next-text="'Next'"
        :container-class="'pagination'"
        :page-class="'page-item'"
      />
    </div>
  </div>
</template>
<script>
import axios from 'axios';
import Paginate from 'vuejs-paginate-next';
import { onMounted, reactive, inject } from 'vue';

// 모달
import { openModal } from 'jenesius-vue-modal';
import StuInfoModal from './StuInfoModal.vue';
import RegJobModal from './RegJobModal.vue';

export default {
  components: {
    Paginate,
  },
  setup() {
    const $emitter = inject('$emitter');

    onMounted(() => {
      reglist();
      joblist();

      // 입력 성공 시 페이지 초기화
      $emitter.on('result', () => {
        reglist(1);
        joblist(1);
      });
    });

    const regInfo = reactive({
      pageNum: 1,
      pageTotal2: 5,
      searchStuName: '',

      jobRegitList: [],
      totalCnt2: 0,
      totalpage: 0,
    });

    const jobInfo = reactive({
      pageNum: 1,
      pageTotal: 5,

      jobList: [],
      totalCnt: 0,
      totalpage: 0,
    });

    function reglist(pageNum) {
      regInfo.pageNum = pageNum || regInfo.pageNum;

      const params = new URLSearchParams();
      params.append('pageNum', regInfo.pageNum);
      params.append('pageTotal2', regInfo.pageTotal2);
      params.append('searchStuName', regInfo.searchStuName);

      // for(const [key, value] of params.entries()) {
      //    console.log(key, value);
      // }

      axios
        .post('/admin/VuejobListRegitDtl.do', params)
        .then((response) => {
          regInfo.jobRegitList = response.data.jobRegitList;
          regInfo.totalCnt2 = response.data.totalCnt2;
          regInfo.totalpage = page(regInfo.totalCnt2, regInfo.pageTotal2);
        })
        .catch((error) => {
          console.log(error);
        });
    }

    function joblist(pageNum) {
      jobInfo.pageNum = pageNum || jobInfo.pageNum;

      const params = new URLSearchParams();
      params.append('pageNum', jobInfo.pageNum);
      params.append('pageTotal', jobInfo.pageTotal);

      // for(const [key, value] of params.entries()) {
      //    console.log(key, value);
      // }

      axios
        .post('/admin/VuejobListDtl.do', params)
        .then((response) => {
          jobInfo.jobList = response.data.jobList;
          jobInfo.totalCnt = response.data.totalCnt;
          jobInfo.totalpage = page(jobInfo.totalCnt, jobInfo.pageTotal);
        })
        .catch((error) => {
          console.log(error);
        });
    }

    function showInfo(loginID) {
      const params = new URLSearchParams();
      params.append('loginID', loginID);

      axios.post('/admin/showInfo2.do', params).then(async (response) => {
        const modal = await openModal(StuInfoModal, {
          infoShow2: response.data.infoShow2,
        });

        modal.onclose = function () {
          console.log('close');
        };
      });
    }

    async function regJob(loginID) {
      const modal = await openModal(RegJobModal, {
        loginID: loginID,
      });

      modal.onclose = function () {
        console.log('close');
      };
    }

    /**
     *
     * @param {*} total 총 데이터 개수
     * @param {*} page  한 화면에 뿌려질 최대 데이터 개수
     */
    function page(total, page) {
      // 총 만들어지는 페이지 개수
      const result = parseInt(total / page);
      // 만들어지고 남는 페이지 개수
      const etc = total % page;
      return etc === 0 ? result : result + 1;
    }

    return {
      reglist,
      regInfo,
      joblist,
      jobInfo,
      showInfo,
      regJob,
    };
  },
};
</script>
<style>
 #jobRegitList tr:hover{
  cursor: pointer;
  background-color: rgba(184, 184, 184, 0.5);
 }
</style>
