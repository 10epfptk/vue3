<template>
  <div class="content">
    <p class="Location">
      <a href="../dashboard/dashboard.do" class="btn_set home">메인으로</a>
      <span class="btn_nav bold">학습 지원</span>
      <span class="btn_nav bold">강의 계획서</span>
    </p>

    <p class="conTitle"><span>진행중인 강의</span> <span class="fr"> </span></p>

    <div id="leclist">
      <table class="col">
        <colgroup>
          <col width="30%" />
          <col width="20%" />
          <col width="20%" />
          <col width="20%" />
          <col width="10%" />
        </colgroup>
        <thead>
          <tr>
            <th scope="col">강의 이름</th>
            <th scope="col">인원 현황</th>
            <th scope="col">강의실</th>
            <th scope="col">진행 날짜</th>
            <th scope="col">시험</th>
          </tr>
        </thead>
        <template v-if="totalCnt === 0">
          <tbody>
            <tr>
              <td colspan="4">데이터가 존재하지 않습니다.</td>
            </tr>
          </tbody>
        </template>
        <template v-else>
          <tbody
            id="tbodyleclist"
            v-for="lec in lecListItem"
            :key="lec.lec_seq"
          >
            <tr>
              <td>
                <a href="" @click.prevent="selectedLec(lec.lec_seq, event)">{{
                  lec.lec_name
                }}</a>
              </td>
              <td>{{ lec.lec_now }} / {{ lec.lec_max }}</td>
              <td>{{ lec.rm_name }}</td>
              <td>{{ lec.lec_st }} ~ {{ lec.lec_ed }}</td>
              <td>{{ lec.test_name }}</td>
            </tr>
          </tbody>
        </template>
      </table>
      <div id="leclistPagination" class="paging_area">
        <paginate
          class="justify-content-center"
          v-model="currentPage"
          :page-count="totalPage"
          :page-range="5"
          :margin-pages="0"
          :click-handler="readLecList"
          :prev-text="'Prev'"
          :next-text="'Next'"
          :container-class="'pagination'"
          :page-class="'page-item'"
        >
        </paginate>
      </div>

      <br />
    </div>

    <div id="lecplan" v-show="showLecPlan">
      <p class="conTitle">
        <span>강의 계획서</span>
        <span class="fr"> </span>
      </p>

      <div id="leclist">
        <table class="col">
          <colgroup>
            <col width="10%" />
            <col width="40%" />
            <col width="35%" />
            <col width="15%" />
          </colgroup>
          <thead>
            <tr>
              <th scope="col">날짜</th>
              <th scope="col">내용</th>
              <th scope="col">목표</th>
              <th scope="col"></th>
            </tr>
          </thead>
          <template v-if="pTotalCnt === 0">
            <tbody>
              <tr>
                <td colspan="4">데이터가 존재하지 않습니다.</td>
              </tr>
            </tbody>
          </template>
          <template v-else>
            <tbody
              id="tbodyplanlist"
              v-for="(plan, index) in lecPlanItem"
              :key="index"
            >
              <tr>
                <td>{{ plan.lec_week }}주차</td>
                <td>{{ plan.lec_cont }}</td>
                <td>{{ plan.lec_gl }}</td>
                <td>
                  <a
                    href=""
                    class="btnType blue"
                    name="btn"
                    @click.prevent="showPlanModal(plan.lec_week)"
                    ><span>수정</span></a
                  >
                </td>
              </tr>
            </tbody>
          </template>
        </table>
      </div>
      <div class="paging_area" id="planlistPagination">
        <paginate
          class="justify-content-center"
          v-model="pCurrentPage"
          :page-count="pTotalPage"
          :page-range="5"
          :margin-pages="0"
          :click-handler="readLecPlan"
          :prev-text="'Prev'"
          :next-text="'Next'"
          :container-class="'pagination'"
          :page-class="'page-item'"
        >
        </paginate>
      </div>
    </div>
  </div>
</template>

<script>
import paginate from 'vuejs-paginate-next';
import { openModal } from 'jenesius-vue-modal';
import VueplanModal from '@/views/tch/VueplanModal.vue';
export default {
  data: function () {
    return {
      //강의 리스트
      lecSeq: '',
      lecListItem: [],

      currentPage: 1,
      totalPage: 1,
      pageSize: 5,
      totalCnt: 0,

      //강의 계획서
      lecPlanItem: [],
      pCurrentPage: 1,
      pTotalPage: 1,
      pPageSize: 5,
      pTotalCnt: 0,
      showLecPlan: false,
    };
  },
  components: {
    paginate: paginate,
  },
  mounted() {
    this.readLecList();
  },
  methods: {
    /** 강의 목록 조회 */
    readLecList: function (pageNum) {
      this.currentPage = pageNum || 1;
      let params = new URLSearchParams();
      params.append('pagenum', this.currentPage);
      params.append('pageSize', this.pageSize);

      this.axios
        .post('/tch/vueleclist.do', params)
        .then((result) => {
          console.log('강의 목록');
          console.log(result);
          this.lecListItem = result.data.leglist;
          this.totalCnt = result.data.totalcnt;
          this.totalPage = this.page(this.totalCnt, this.pageSize);
          this.showLecPlan = false;
        })
        .catch((error) => {
          alert(`readLecList() 에러: ${error}`);
        });
    },

    /** 강의 클릭 - lecSeq 저장*/
    selectedLec: function (lecSeq) {
      this.lecSeq = lecSeq;
      this.readLecPlan();
    },
    /** 강의 계획서 조회 */
    readLecPlan: function (pageNum) {
      this.pCurrentPage = pageNum || 1;
      console.log(`선택된 강의 번호.. ${this.lecSeq}`);

      let params = new URLSearchParams();
      params.append('pageSize', this.pPageSize);
      params.append('pagenum', this.pCurrentPage);
      params.append('lec_seq', this.lecSeq);

      this.axios
        .post('/tch/vueplanlist.do', params)
        .then((result) => {
          console.log('강의 계획서');
          console.log(result);
          this.lecPlanItem = result.data.legplanlist;
          this.pTotalCnt = result.data.legplantotalcnt;
          this.pTotalPage = this.page(this.pTotalCnt, this.pPageSize);
          this.showLecPlan = true;
        })
        .catch((error) => {
          alert(`readLecPlan() 에러: ${error}`);
        });
    },
    /** 페이징 */
    page: function (total, page) {
      let remainder = total % page;
      let pageCnt = parseInt(total / page);

      if (remainder == 0) {
        return pageCnt;
      } else {
        return (pageCnt += 1);
      }
    },
    /** 강의 계획서 팝업 on */
    showPlanModal: async function (lecWeek) {
      //promise 반환(비동기 메서드에서 마치 동기 메서드처럼 값을 반환)
      //그럼 몇 주차인지를 데이터를 받아올 때까지 기다렸다가 모달을 열겠다는 건가보군..
      const modal = await openModal(VueplanModal, {
        //promise가 처리될 때까지 대기
        mTitle: '강의 계획 수정',
        mLecWeek: lecWeek,
        mLecSeq: this.lecSeq,
      });
      modal.onclose = (popupParam) => {
        console.log(`모달 닫음 ${popupParam}`);
        this.readLecPlan();
      };
    },
  },
};
</script>

<style></style>
