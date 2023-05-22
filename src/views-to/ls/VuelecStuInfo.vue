<template>
  <div class="content">
    <p class="Location">
      <a href="../dashboard/dashboard.do" class="btn_set home">메인으로</a> <span class="btn_nav bold">학습 관리</span> <span
        class="btn_nav bold">수강생 정보</span>
      <a href="../ls/lecStuInfo.do" class="btn_set refresh">새로고침</a>
    </p>

    <p class="conTitle" id="searcharea">
      <span>수업 정보</span> <span class="fr">
        <select id="myLecList" name="myLecList" style="width: 200px;" v-model="searchKey">
          <option value="all">수업 선택</option>
          <template v-for="item in seclist" :key="item.lec_seq">
            <option :value="item.lec_seq">{{ item.lec_name }}</option>
          </template>
        </select>
        <a href="" class="btnType blue" @Click.prevent="fn_searchLec(searchKey)"><span>검 색</span></a>
      </span>
    </p>

    <div id="lecinfolist" v-show="shows1">
      <table class="col">
        <caption>caption</caption>
        <colgroup>
          <col width="15%">
          <col width="15%">
          <col width="15%">
          <col width="15%">
          <col width="15%">
          <col width="10%">
          <col width="10%">
        </colgroup>

        <thead>
          <tr>
            <th scope="col">강의명</th>
            <th scope="col">강사명</th>
            <th scope="col">개강일</th>
            <th scope="col">종강일</th>
            <th scope="col">강의실</th>
            <th scope="col">현재인원</th>
            <th scope="col">정원</th>
          </tr>
        </thead>
        <tbody v-for="item in leclist" :key="item.lec_seq">
          <tr>
            <td>{{ item.lec_name }}</td>
            <td>{{ item.tch_name }}</td>
            <td>{{ item.lec_st }}</td>
            <td>{{ item.lec_ed }}</td>
            <td>강의실 {{ item.rm_name }}</td>
            <td>{{ item.lec_now }}</td>
            <td>{{ item.lec_max }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <table>
      <tr style=" border: 0px; border-color: blue">
        <td width="80" height="25" style="font-size: 120%;">&nbsp;&nbsp;</td>
        <td width="50" height="25" style="font-size: 100%; text-align:left; padding-right:25px;"></td>
      </tr>
    </table>
    <div id="stuinfolist" v-show="shows2">
      <p class="conTitle mt50">
        <span>수강생 명단</span>
      </p>
      <div>
        <table class="col" id="tableStuList" name="tableStuList">
          <caption>caption</caption>
          <colgroup>
            <col width="5%">
            <col width="10%">
            <col width="10%">
            <col width="17%">
            <col width="25%">
            <col width="10%">
            <col width="10%">
            <col width="13%">
          </colgroup>

          <thead>
            <tr>
              <th scope="col">NO</th>
              <th scope="col">이름</th>
              <th scope="col">학번</th>
              <th scope="col">연락처</th>
              <th scope="col">이메일</th>
              <th scope="col">설문</th>
              <th scope="col">시험점수</th>
              <th scope="col">수강 취소<span class="fr"> <a class="btnType blue" href="javascript:fPopModalComnDtlCod();"
                    name="modal"></a></span></th>
            </tr>
          </thead>
          <template v-if="totalcnt == 0">
            <tbody>
              <tr>
                <td colspan="8">조회된 데이터가 없습니다.</td>
              </tr>
            </tbody>
          </template>
          <template v-else>
            <tbody v-for="(item, index) in listitem" :key="item.stu_num">
              <tr>
                <td>{{ index + 1 }}</td>
                <td>{{ item.stu_name }}</td>
                <td>{{ item.stu_num }}</td>
                <td>{{ item.stu_hp }}</td>
                <td>{{ item.stu_email }}</td>
                <td>{{ item.que_yn }}</td>
                <template v-if="item.ts_sco == null">
                  <td>미응시</td>
                </template>
                <template v-else>
                  <td>{{ item.ts_sco }}</td>
                </template>
                <td><a href="" @click.prevent="fn_canselLec(item.stuID, item.lec_seq)" class="btnType blue" name="btn"
                    v-if="item.lec_state == 'EX' || item.lec_state == 'USE'"><span>취소</span></a></td>
              </tr>
            </tbody>
          </template>
        </table>
        <div id="stdPagination">
          <paginate class="justify-content-center" v-model="cpage" :page-count="totalPage" :page-range="5"
            :margin-pages="0" :click-handler="fn_stuInfoSearch" :prev-text="'Prev'" :next-text="'Next'"
            :container-class="'pagination'" :page-class="'page-item'">
          </paginate>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Swal from "sweetalert2";
import Paginate from 'vuejs-paginate-next';

export default {
  data: function () {
    return {
      //search
      leclist: [],
      searchKey: "all",
      seclist: [],
      listitem: [],
      shows1: false,
      shows2: false,
      totalcnt: 0,
      totalPage: 0,
      cpage: 1,
      pageSize: 5,
      blockPage: 10,
      lec_state: "",


    };
  },
  mounted() {
    this.SelectLecList();
  },
  methods: {
    SelectLecList: function () {
      let vm = this;

      let params = new URLSearchParams();

      this.axios.post('/ls/VueSelectLecList.do', params).then(function (response) {
        console.log(response);
        vm.seclist = response.data.myLecList;
      });

    },

    fn_searchLec: function (lecseq) {

      this.cpage = lecseq || 1;
      if (this.searchKey == "all") {
        alert("강의를 선택해 주세요");
        this.shows1 = false;
        this.shows2 = false;
        return;
      };
      let vm = this;

      let params = new URLSearchParams();

      params.append("lecSeq", lecseq);
      this.axios.post('/ls/VuelecInfo.do', params).then(function (response) {
        console.log(response);
        vm.leclist = response.data.lecInfoResult;
        vm.shows1 = true;
        vm.shows2 = true;

        vm.fn_stuInfoSearch();


      });


    },
    fn_stuInfoSearch: function (reset) {
      let vm = this;
      this.cpage = reset || 1;



      let params = new URLSearchParams();
      params.append('pagenum', this.cpage);
      params.append('pageSize', this.pageSize);
      params.append('lecSeq', this.searchKey);

      this.axios.post('/ls/VuestuInfoList.do', params).then(function (response) {
        console.log(response);
        vm.listitem = response.data.stuInfoResult;
        vm.totalcnt = response.data.totalcnt;
        vm.totalPage = vm.page(vm.totalcnt, vm.pageSize);
        vm.lec_state = response.data.stuInfoResult.lec_state;

      });
    },
    page: function (totalcnt, pageSize) {
      var xx = totalcnt % pageSize;
      var result = parseInt(totalcnt / pageSize);

      if (xx == 0) {
        return result;
      } else {
        result += 1;
        return result;
      }
    },
    fn_canselLec: function (stuid, lecseq) {
      let params = new URLSearchParams();
      let vm = this;
      console.log(stuid + "###################");
      console.log(lecseq + "###################");
      Swal.fire({
        text: "수강을 취소하시겠습니까?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: '삭제'
      }).then((data) => {
        if (data.isConfirmed) {
          params.append('stuID', stuid);
          params.append('lecSeq', lecseq);


          this.axios.post('/ls/stuCanselLec.do', params).then(function (result) {
            if (result.data.returnVal > 0) {
              Swal.fire("수강 취소가 완료되었습니다.", {
                icon: "success",
                cancelButtonText: "확인"
              });

            } else {
              Swal.fire("오류가 발생했습니다.", {
                icon: "error",
                buttons: "확인"
              });
            }
            vm.fn_searchLec();
            vm.shows2 = false;
            vm.searchKey = 'all';
          });
        }
      });
    },
  },
  computed: {
  },
  components: {
    paginate: Paginate,
  },
}
</script>
