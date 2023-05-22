<template>
  <div id="comnCodMgr">
    <p class="Location">
      <a href="/#/dashboard/home" class="btn_set home"></a>
      <span class="btn_nav bold">학습 관리</span>
      <span class="btn_nav bold">수강 상담 이력</span>
      <a href="/#/dashboard/ac/VueaCounsel" class="btn_set refresh">새로고침</a>
    </p>

    <p class="conTitle" id="seararea">
      <span>상담 관리</span>
      <span class="fr">
        <div
          style="width: 350px; display: flex; justify-content: space-between"
        >
          강의명:
          <input
            type="text"
            style="width: 200px; height: 25px"
            id="inputLecName"
            name="inputLecName"
            v-model="inputLecName"
            v-on:keyup.enter="listsearch()"
          />
          <a
            class="btnType blue"
            id="btnSearchLec"
            name="btn"
            @click="listsearch()"
            ><span>검 색</span></a
          >
        </div>
      </span>
    </p>

    <div id="listarea">
      <table class="col">
        <colgroup>
          <col width="20%" />
          <col width="50%" />
          <col width="30%" />
        </colgroup>

        <thead>
          <tr>
            <th scope="col">과정 ID</th>
            <th scope="col">과정명</th>
            <th scope="col">기간</th>
          </tr>
        </thead>

        <template v-if="totalcnt === 0">
          <tbody>
            <tr>
              <td colspan="3">조회된 데이터가 없습니다.</td>
            </tr>
          </tbody>
        </template>
        <template v-else>
          <tbody v-for="item in listitem" :key="item.lec_seq">
            <tr>
              <td>{{ item.lec_seq }}</td>
              <td>
                <a
                  href=""
                  @click.prevent="searchstudentrow(item.lec_seq, item.lec_name)"
                  >{{ item.lec_name }}</a
                >
              </td>
              <td>{{ item.lec_st }} &#126; {{ item.lec_ed }}</td>
            </tr>
          </tbody>
        </template>
      </table>
    </div>

    <div id="lecPagination" class="paging_area">
      <paginate
        class="justify-content-center"
        v-model="cpage"
        :page-count="totalPage"
        :page-range="5"
        :margin-pages="0"
        :click-handler="listsearch"
        :prev-text="'Prev'"
        :next-text="'Next'"
        :container-class="'pagination'"
        :page-class="'page-item'"
      >
      </paginate>
    </div>
    <!-- 상담 목록 ------------------------------------------------------------------------------------------------------------------------------>
    <div v-show="cnsBox">
      <p class="conTitle mt50" id="stusearcharea">
        <span>상담 목록</span>
        <span class="fr"
          ><div
            style="width: 490px; display: flex; justify-content: space-between"
          >
            <select
              id="selectKey"
              name="selectKey"
              style="width: 100px"
              v-model="searchKey"
            >
              <option value="all">전체</option>
              <option value="stu">학생명</option>
              <option value="tch">상담자명</option>
            </select>

            <input
              type="text"
              style="width: 200px; height: 25px"
              id="inputSearchCns"
              name="inputSearchCns"
              v-model="inputSearchCns"
              v-on:keyup.enter="searchstudent()"
            />
            <a
              href=""
              class="btnType blue"
              id="btnSearchCns"
              name="btn"
              @click.prevent="searchstudent()"
              ><span>검 색</span></a
            >
            <a
              href=""
              class="btnType blue"
              @click.prevent="counselRegPopup('I')"
              name="modal"
              ><span>상담 등록</span></a
            >
          </div>
        </span>
      </p>

      <div id="stuList">
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
          <template v-if="stdtotalcnt === 0">
            <tbody>
              <tr>
                <td colspan="5">조회된 데이터가 없습니다.</td>
              </tr>
            </tbody>
          </template>

          <template v-else>
            <tbody v-for="item in stdlistitem" :key="item.cns_seq">
              <tr>
                <td>{{ item.cns_seq }}</td>
                <td>{{ item.lec_name }}</td>
                <td>
                  <a href="" @click.prevent="viewCounselDetails(item.cns_seq)"
                    >{{ item.stu_name }}({{ item.stu_id }})</a
                  >
                </td>
                <td>{{ item.cns_date }}</td>
                <td>{{ item.name }}({{ item.loginID }})</td>
              </tr>
            </tbody>
          </template>
        </table>
      </div>
      <div id="stdPagination" class="paging_area">
        <paginate
          class="justify-content-center"
          v-model="stdcpage"
          :page-count="stdtotalPage"
          :page-range="5"
          :margin-pages="0"
          :click-handler="searchstudent"
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
import { openModal } from 'jenesius-vue-modal';
import addCounselModal from '@/views/ac/addCounselModal.vue';
import Paginate from 'vuejs-paginate-next';
import swal from 'sweetalert';

export default {
  data: function () {
    return {
      // 상담 관리---------
      inputLecName: '',

      listitem: [],
      totalcnt: 0,
      cpage: 1,
      pagesize: 5,
      totalPage: 1,

      // 상담 목록----------
      cnsBox: false,
      searchKey: 'all',
      inputSearchCns: '',
      stdlistitem: [],
      stdtotalcnt: 0,
      stdcpage: 1,
      stdtotalPage: 1,
      stdpagesize: 5,

      lecseq: 0,
      lecname: '',
      cnsseq: 0,

      action: '',

      delflag: false,
    };
  },
  components: {
    paginate: Paginate,
  },
  mounted() {
    this.listsearch();
  },
  methods: {
    /** 강의 목록 */
    listsearch: function (pageNum) {
      this.cpage = pageNum || 1;
      this.cnsBox = false;

      console.log(`현재 페이지: ${this.cpage}`);

      //검색 시 페이지 초기화

      let params = new URLSearchParams();
      params.append('pagenum', this.cpage);
      params.append('pageSize', this.pagesize);
      params.append('lecName', this.inputLecName);

      this.axios
        .post('/ac/vuelecList.do', params)
        .then((response) => {
          console.log(response);

          this.totalcnt = response.data.totalcnt;
          this.listitem = response.data.lecList;
          this.totalPage = this.page(this.totalcnt, this.pagesize);
        })
        .catch(function (error) {
          alert('에러! API 요청에 오류가 있습니다. ' + error);
        });
    },
    /** 페이징 처리 */
    page: function (total, page) {
      //var total = this.totalcnt;
      //var page = this.pagesize;
      var xx = total % page;
      var result = parseInt(total / page);

      if (xx == 0) {
        return result;
      } else {
        result = result + 1;
        return result;
      }
    },
    /** 상담 클릭 - 강의 번호, 강의명 백업*/
    searchstudentrow: function (lec_seq, lec_name) {
      this.lecseq = lec_seq;
      this.lecname = lec_name;

      this.searchstudent();
      this.cnsBox = true;
    },
    /** 상담 목록 */
    searchstudent: function (pageNum) {
      this.stdcpage = pageNum || 1;
      let name = '';
      let stuName = '';
      console.log(this.$data);

      switch (this.searchKey) {
        case 'tch':
          name = this.inputSearchCns;
          break;
        case 'stu':
          stuName = this.inputSearchCns;
          break;
        case 'all':
          if (this.inputSearchCns != '') {
            this.$swal('검색하실 키워드를 선택해주세요.');
            break;
          }
      }

      let params = new URLSearchParams();
      params.append('pagenum', this.stdcpage);
      params.append('pageSize', this.pagesize);
      params.append('lecSeq', this.lecseq);
      params.append('name', name);
      params.append('stuName', stuName);

      this.axios
        .post('/ac/vuestuList.do', params)
        .then((response) => {
          console.log(response);
          this.stdtotalcnt = response.data.totalcnt;
          this.stdlistitem = response.data.stuList;
          this.stdtotalPage = this.page(this.stdtotalcnt, this.stdpagesize);
        })
        .catch(function (error) {
          alert('에러! API 요청에 오류가 있습니다. ' + error);
        });
    },
    /** 한 건 조회 */
    viewCounselDetails: function (cns_seq) {
      this.cnsseq = cns_seq;
      this.counselRegPopup('U');
    },
    /** 팝업 on */
    counselRegPopup: async function (action) {
      this.action = action;

      let paramTitle = '';
      let cnsseq = '';

      if (action == 'I') {
        paramTitle = '상담 등록';
      } else {
        paramTitle = '상담 수정';
        cnsseq = this.cnsseq;
      }

      if (this.lecseq === 0) {
        swal('강의를 선택해주세요.');
        return;
      }

      const modal = await openModal(addCounselModal, {
        ptitle: paramTitle,
        plecseq: this.lecseq,

        pcnsseq: cnsseq,
        paction: this.action,
        plecname: this.lecname,
      });

      modal.onclose = (popupparam) => {
        console.log('Close : ' + popupparam);
        this.stdcpage = 1;
        this.searchstudent();
        //return false; //Modal will not be closed
      };
    },
  },
};
</script>

<style>
#searchArea {
  margin-top: 25px;
  margin-bottom: 25px;
}
#searchArea > * {
  height: auto;
}

#groupTitle {
  text-decoration: underline;
  font-weight: bold;
  cursor: pointer;
}
</style>
