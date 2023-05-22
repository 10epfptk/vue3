<template>
  <div class="content">
    <p class="Location">
      <a href="../dashboard/dashboard.do" class="btn_set home">메인으로</a>
      <span class="btn_nav bold">취업관리</span>
      <span class="btn_nav bold">이력서 관리</span>
    </p>

    <p class="conTitle"><span>학생</span> <span class="fr"> </span></p>

    <!-- ----------------------------------- 학생 목록 시작 -->
    <div id="studentList">
      <table class="col">
        <caption>
          caption
        </caption>
        <colgroup>
          <col width="20%" />
          <col width="30%" />
          <col width="20%" />
          <col width="30%" />
        </colgroup>

        <thead>
          <tr>
            <th scope="col">학번</th>
            <th scope="col">학생 이름</th>
            <th scope="col">전화번호</th>
            <th scope="col">이메일</th>
          </tr>
        </thead>
        <tbody v-for="item in listitem" :key="item.loginID">
          <tr>
            <td>
              <a href="" @click.prevent="resumeListsearch(item.loginID)">{{
                item.stu_num
              }}</a>
            </td>
            <td>{{ item.name }}</td>
            <td>{{ item.hp }}</td>
            <td>{{ item.email }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 학생 목록 페이징처리 영역 시작 -->
    <div id="stuListPagination">
      <paginate
        class="justify-content-center"
        v-model="cpage"
        :page-count="totalPage"
        :page-range="5"
        :margin-pages="0"
        :click-handler="stuList"
        :prev-text="'Prev'"
        :next-text="'Next'"
        :container-class="'pagination'"
        :page-class="'page-item'"
      >
      </paginate>
    </div>
    <!-- 페이징처리 영역 끝 -->

    <!-- ----------------------------------- 이력서 목록 시작 -->
    <div v-show="show">
      <p class="conTitle">
        <span>이력서</span>
        <span class="fr"></span>
      </p>

      <div id="resumeList">
        <table class="col">
          <caption>
            caption
          </caption>
          <colgroup>
            <col width="70%" />
            <col width="30%" />
          </colgroup>

          <thead>
            <tr>
              <th scope="col">한줄 소개</th>
              <th scope="col">등록일자</th>
            </tr>
          </thead>
          <template v-if="resumeListCnt === 0">
            <tbody>
              <tr>
                <td colspan="2">조회 할 데이터가 없습니다.</td>
              </tr>

              <tr />
            </tbody>
          </template>
          <template v-else>
            <tbody v-for="item in resumeItemList" :key="item.res_seq">
              <tr>
                <td>
                  <a
                    href=""
                    @click.prevent="
                      fn_resumePopUp(
                        item.res_seq,
                        item.res_self,
                        item.res_selfone
                      )
                    "
                    >{{ item.res_self }}</a
                  >
                </td>
                <td>{{ item.res_regdate }}</td>
              </tr>
            </tbody>
          </template>
        </table>
      </div>
      <div id="stdPagination">
        <paginate
          class="justify-content-center"
          v-model="rcpage"
          :page-count="restotalPage"
          :page-range="5"
          :margin-pages="0"
          :click-handler="resumeSelect"
          :prev-text="'Prev'"
          :next-text="'Next'"
          :container-class="'pagination'"
          :page-class="'page-item'"
        >
        </paginate>
      </div>
    </div>
  </div>
  <!-- div class="content" 닫힘-->
</template>

<script>
import { openModal } from 'jenesius-vue-modal';
import mdResume from './mdResume.vue';
import Paginate from 'vuejs-paginate-next';

export default {
  data: function () {
    return {
      listitem: [],
      totalcnt: 0,
      cpage: 1,
      currentPage: 0,
      pageSize: 5,
      blocksize: 10,
      totalPage: 1,
      loginID: '',

      resumeItemList: [],
      rcpage: 1,
      rloginID: '',
      res_seq: '',
      resumeListCnt: 0,
      rcurrentPage: 0,
      rpageSize: 5,
      rblocksize: 10,
      restotalPage: 1,
      show: false,

      selfone: '',
      self: '',
    };
  },
  components: {
    paginate: Paginate,
  },
  mounted() {
    this.stuList();
  },
  methods: {
    stuList: function () {
      let vm = this;

      let params = new URLSearchParams();

      this.show = false;

      params.append('currentPage', this.cpage);
      params.append('pageSize', this.pageSize);

      this.axios
        .post('/admin/vuestuList.do', params)
        .then(function (response) {
          console.log(response);
          vm.totalcnt = response.data.stuListCnt;
          vm.listitem = response.data.stuList;
          vm.totalPage = vm.page(vm.totalcnt, vm.pageSize);
        })
        .catch(function (error) {
          alert('에러! API 요청에 오류가 있습니다. ' + error);
        });
    },
    resumeListsearch: function (loginid) {
      this.loginID = loginid;
      this.resumeSelect();
    },
    resumeSelect: function (resetpage) {
      let vm = this;

      let params = new URLSearchParams();

      this.show = true; //학생 리스트에서 학번 누르면 이력서 리스트 보이도록 v-show 작업
      this.rcpage = resetpage || 1;

      params.append('currentPage', this.rcpage);
      params.append('pageSize', this.rpageSize);
      params.append('loginID', this.loginID);

      this.axios
        .post('/admin/vueresumeList.do', params)
        .then(function (response) {
          console.log(response);
          vm.resumeListCnt = response.data.resumeListCnt;
          vm.resumeItemList = response.data.resumeList;
          vm.restotalPage = vm.page(vm.resumeListCnt, vm.rpageSize);
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
    fn_resumePopUp: function (res_seq, res_self, res_selfone) {
      this.res_seq = res_seq;
      this.self = res_self;
      this.selfone = res_selfone;

      console.log('~~~~~~~~~~~~~~~~~~~이력서시퀀스' + res_seq);

      this.fn_resumePopUp2();
    },
    fn_resumePopUp2: async function () {
      const modal = await openModal(mdResume, {
        rresseq: this.res_seq,
        rself: this.self, //한줄소개
        rselfone: this.selfone, //자기소개
      });
      console.log('~~~~~이력서 한줄소개' + this.self);
      console.log('~~~~~이력서 자기소개' + this.selfone);

      modal.onclose = (popupparam) => {
        console.log('Close : ' + popupparam);
        this.resumeSelect();
        //return false; //Modal will not be closed
      };
    },
  },
};
</script>
