<template>
  <div id="comnCodMgr">
    <p class="Location">
      <a href="/dashboard/home" class="btn_set home"></a>
      <span class="btn_nav bold">학습 관리</span>
      <span class="btn_nav bold">수강 상담 이력</span>
      <a href="../system/comnCodMgr.do" class="btn_set refresh">새로고침</a>
    </p>

    <p class="conTitle" id="seararea">
      <span>상담 관리</span>
      <span class="fr">
        강의명:
        <input
          type="text"
          style="width: 200px; height: 25px"
          id="inputLecName"
          name="inputLecName"
          v-model="inputLecName"
        />
        <a
          class="btnType blue"
          id="btnSearchLec"
          name="btn"
          @click="listsearch()"
          ><span>검 색</span></a
        >
      </span>
    </p>

    <div id="listarea">
      <table class="col">
        <caption>
          caption
        </caption>
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
            <tr @click="searchstudentrow(item.lec_seq, item.lec_name)">
              <td>{{ item.lec_seq }}</td>
              <td>{{ item.lec_name }}</td>
              <td>{{ item.lec_st }} &#126; {{ item.lec_ed }}</td>
            </tr>
          </tbody>
        </template>
      </table>
    </div>

    <div id="lecPagination">
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

    <p class="conTitle mt50" id="stusearcharea">
      <span>상담 목록</span>
      <span class="fr">
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
          onkeyup="if(event.keyCode == 13){fn_searchCns()}"
        />
        <a href="" class="btnType blue" id="btnSearchCns" name="btn"
          ><span>검 색</span></a
        >
        <a class="btnType blue" @click="CounselRegPopup('I')" name="modal"
          ><span>상담 등록</span></a
        >
      </span>
    </p>

    <div id="stuList">
      <table class="col">
        <caption>
          caption
        </caption>
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
        <template v-if="totalcnt === 0">
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
              <td @click="viewCounselDetails(item.cns_seq)">
                {{ item.stu_name }}
              </td>
              <td>{{ item.cns_date }}</td>
              <td>{{ item.loginID }}</td>
            </tr>
          </tbody>
        </template>
      </table>
    </div>
    <div id="stdPagination">
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
</template>
<script>
import { openModal } from 'jenesius-vue-modal';
import addCounselModal from './addCounselModal.vue';
import Paginate from 'vuejs-paginate-next';

export default {
  data: function () {
    return {
      inputLecName: '',
      listitem: [],
      totalcnt: 0,
      cpage: 1,
      pagesize: 5,
      blocksize: 10,
      totalPage: 1,
      searchKey: 'all',
      inputSearchCns: '',
      stdlistitem: [],
      stdtotalcnt: 0,
      stdcpage: 1,
      stdtotalPage: 1,
      stdpagesize: 5,
      stdblocksize: 10,
      lecseq: 0,
      lecname: '',
      cLecName: '',
      cStuName: '',
      cnsDate: '',
      cnsPlace: '',
      cnsUpdate: '',
      cnsCont: '',
      action: '',
      cnsseq: 0,
      delflag: false,
      slecseq: 0,
      slecname: '',
    };
  },
  computed: {},
  components: {
    paginate: Paginate,
  },
  mounted() {
    this.listsearch();
  },
  methods: {
    listsearch: function () {
      let vm = this;

      let params = new URLSearchParams();
      params.append('pagenum', this.cpage);
      params.append('pageSize', this.pagesize);
      params.append('lecName', this.inputLecName);

      this.axios
        .post('/ac/vuelecList.do', params)
        .then(function (response) {
          console.log(response);
          vm.totalcnt = response.data.totalcnt;
          vm.listitem = response.data.lecList;
          vm.totalPage = vm.page(vm.totalcnt, vm.pagesize);
        })
        .catch(function (error) {
          alert('에러! API 요청에 오류가 있습니다. ' + error);
        });
    },
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
    searchstudentrow: function (lec_seq, lec_name) {
      this.slecseq = lec_seq;
      this.slecname = lec_name;

      this.searchstudent();
    },
    searchstudent: function () {
      alert(this.slecseq + ' : ' + this.slecname);

      let vm = this;

      let name = '';
      let stuName = '';

      if (this.searchKey == 'tch') {
        name = this.inputSearchCns;
      } else if (this.searchKey == 'stu') {
        stuName = this.inputSearchCns;
      }

      let params = new URLSearchParams();
      params.append('pagenum', this.stdcpage);
      params.append('pageSize', this.pagesize);
      params.append('lecSeq', this.slecseq);
      params.append('name', name);
      params.append('stuName', stuName);

      this.axios
        .post('/ac/vuestuList.do', params)
        .then(function (response) {
          console.log(response);
          vm.stdtotalcnt = response.data.totalcnt;
          vm.stdlistitem = response.data.stuList;
          vm.stdtotalPage = vm.page(vm.stdtotalcnt, vm.stdpagesize);
        })
        .catch(function (error) {
          alert('에러! API 요청에 오류가 있습니다. ' + error);
        });
    },
    viewCounselDetails: function (cns_seq) {
      this.cnsseq = cns_seq;
      this.CounselRegPopup('U');
    },
    CounselRegPopup: async function (action) {
      this.action = action;

      let paramtitle = '';
      let cnsseq = 0;

      if (action == 'I') {
        paramtitle = '상담 등록';
        alert('상담 등록');
      } else {
        paramtitle = '상담 수정';
        alert('상담 수정');
        cnsseq = this.cnsseq;
      }

      const modal = await openModal(addCounselModal, {
        ptitle: paramtitle,
        pslecseq: this.slecseq,
        pscnsseq: cnsseq,
        paction: this.action,
        pslecname: this.slecname,
      });

      modal.onclose = (popupparam) => {
        console.log('Close : ' + popupparam);
        //this.listsearch();
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
