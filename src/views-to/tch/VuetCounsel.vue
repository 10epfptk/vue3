<template>
  <div class="content">
    <p class="Location">
      <a href="../dashboard/dashboard.do" class="btn_set home">메인으로</a>
      <span class="btn_nav bold">학습 관리</span>
      <span class="btn_nav bold">상담</span>
      <a href="../tch/tCounsel.do" class="btn_set refresh">새로고침</a>
    </p>

    <p class="conTitle" id="counselsearch">
      <span>상담 목록</span>
      <span class="fr">
        <div
          style="width: 500px; display: flex; justify-content: space-between"
        >
          <select
            id="selectKey"
            name="selectKey"
            style="width: 100px"
            v-model="searchKey"
          >
            <option value="all">전체검색</option>
            <option value="lec">강의명</option>
            <option value="stu">학생명</option>
          </select>

          <input
            type="text"
            style="width: 200px; height: 25px"
            id="inputSearchCns"
            name="inputSearchCns"
            v-model="inputSearchCns"
            v-on:keyup.enter="search"
          />
          <a
            href=""
            class="btnType blue"
            id="btnSearchCns"
            name="btn"
            @click.prevent="search"
            ><span>검 색</span></a
          >
          <a
            class="btnType blue"
            href=""
            name="modal"
            @click.prevent="openCnsPopup('I')"
            ><span>상담 등록</span></a
          >
        </div>
      </span>
    </p>
    <br />
    <select
      id="myLecList"
      name="myLecList"
      style="width: 200px; float: right"
      v-model="lecSearchKey"
      @change="search"
    >
      <option value="all">전체 과정</option>
      <option
        v-for="item in myLecList"
        :value="item.lec_seq"
        :key="item.lec_seq"
      >
        {{ item.lec_name }}
      </option>
    </select>

    <div class="divComGrpCodList" id="this">
      <table class="col">
        <colgroup>
          <col width="8%" />
          <col width="16%" />
          <col width="27%" />
          <col width="22%" />
          <col width="27%" />
        </colgroup>

        <thead>
          <tr>
            <th scope="col">상담 번호</th>
            <th scope="col">수강 강의</th>
            <th scope="col">학생 명(ID)</th>
            <th scope="col">상담일자</th>
            <th scope="col">강사 (ID)</th>
          </tr>
        </thead>
        <template v-if="totalCnt == 0">
          <tbody>
            <tr>
              <td colspan="5">조회된 데이터가 없습니다.</td>
            </tr>
          </tbody>
        </template>
        <template v-else>
          <tbody v-for="item in itemList" :key="item.cns_seq">
            <tr>
              <td>{{ item.cns_seq }}</td>
              <td>
                {{ item.lec_name }}
              </td>
              <td>
                <a
                  href=""
                  @click.prevent="viewCnsDetails(item.lec_seq, item.cns_seq)"
                  >{{ item.stu_name }}({{ item.stu_id }})</a
                >
              </td>
              <td>{{ item.cns_date }}</td>
              <td>{{ item.name }}({{ item.loginID }})</td>
            </tr>
          </tbody>
        </template>
      </table>
      <div id="counselPagination" class="paging_area">
        <paginate
          class="justify-content-center"
          v-model="currentPage"
          :page-count="totalPage"
          :page-range="5"
          :margin-pages="0"
          :click-handler="myCnsList"
          :prev-text="'Prev'"
          :next-text="'Next'"
          :container-class="'pagination'"
          :page-class="'page-item'"
        ></paginate>
      </div>
    </div>
  </div>
  <!--// content -->
</template>

<script>
import paginate from 'vuejs-paginate-next';
import { openModal } from 'jenesius-vue-modal';
import VuetCounselModal from '@/views/tch/VuetCounselModal.vue';

export default {
  data: function () {
    return {
      searchKey: 'all',
      inputSearchCns: '',
      lecName: '',
      stuName: '',

      myLecList: [],
      lecSearchKey: 'all',
      lecSeq: 'all',

      itemList: [],

      currentPage: 1,
      totalPage: 1,
      pageSize: 5,
      blockSize: 10,
      totalCnt: 0,
    };
  },
  components: {
    paginate: paginate,
  },
  mounted() {
    this.readLecList();
    this.myCnsList();
  },
  methods: {
    /** 강의 목록(selectBox) */
    readLecList: function (pageNum) {
      console.log(`넘어온 페이지 번호: ${pageNum}`);
      this.currentPage = pageNum || 1;
      let params = new URLSearchParams();
      this.axios
        .post('/tch/vueselBoxLecList.do', params)
        .then((response) => {
          console.log('강의 목록');
          console.log(response);
          this.myLecList = response.data.result;
        })
        .catch(function (error) {
          alert('readLecList() 에러! API 요청에 오류가 있습니다. ' + error);
        });
    },
    /** 검색 기능 */
    search: function () {
      let total = this.searchKey === 'all' && this.inputSearchCns === '';

      if (!total && this.searchKey === 'all') {
        this.$swal('키워드를 선택해주세요.');
        return;
      }

      if (!total && this.inputSearchCns === '') {
        this.$swal('검색어를 입력해주세요.');
        return;
      }

      // input 박스
      if (this.searchKey === 'stu') {
        this.stuName = this.inputSearchCns;
        this.lecName = '';
      } else {
        this.stuName = '';
        this.lecName = this.inputSearchCns;
      }
      this.lecSeq = this.lecSearchKey;
      this.currentPage = 1;
      this.myCnsList();
    },
    /** 강사의 상담 리스트 */
    myCnsList: function () {
      let params = new URLSearchParams();
      console.log(`currentPage: ${this.currentPage}`);
      params.append('pagenum', this.currentPage);
      params.append('pageSize', this.pageSize);
      params.append('lecSeq', this.lecSeq);
      params.append('lecName', this.lecName);
      params.append('stuName', this.stuName);

      this.axios
        .post('/tch/myvueCounselList.do', params)
        .then((response) => {
          console.log('상담 리스트');
          console.log(response);
          this.itemList = response.data.clist;
          this.totalCnt = response.data.totalcnt;
          this.totalPage = this.page(this.totalCnt, this.pageSize);
        })
        .catch((error) => {
          alert('myCnsList() API 요청 오류: ' + error);
        });
    },
    /** 페이징 */
    page: function (total, page) {
      let remainder = total % page;
      let pageCnt = parseInt(total / page);

      if (remainder == 0) {
        return pageCnt;
      } else {
        pageCnt += 1;
        return pageCnt;
      }
    },
    /** 한 건 조회 */
    viewCnsDetails: function (lecSeq, cnsSeq) {
      this.lecSeq = lecSeq;
      this.cnsSeq = cnsSeq;
      console.log(this.cnsSeq);
      this.openCnsPopup('U');
    },
    /** 상담 팝업 on */
    openCnsPopup: async function (action) {
      this.action = action;

      let paramTitle = '';

      if (action === 'I') {
        paramTitle = '상담 등록';
      } else {
        paramTitle = '상담 수정';
      }
      console.log(
        `${paramTitle}중... action: ${this.action}, lecSeq: ${this.lecSeq}, cnsSeq: ${this.cnsSeq} 팝업 열어요~`
      );
      const modal = await openModal(VuetCounselModal, {
        pTitle: paramTitle,
        pLecseq: this.lecSeq,
        pCnsSeq: this.cnsSeq,

        pAction: this.action,
      });

      modal.onclose = (popupParam) => {
        console.log('모달 닫아요: ' + popupParam);
        this.lecSeq = 'all';
        this.myCnsList();
      };
    },
  },
}; //export end
</script>
