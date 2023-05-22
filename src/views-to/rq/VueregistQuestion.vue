<template>
  <div id="comnCodMgr">
    <p class="Location">
      <a href="/dashboard/home" class="btn_set home"></a>
      <span class="btn_nav bold">학습 관리</span>
      <span class="btn_nav bold">시험 관리</span>
      <a href="../system/comnCodMgr.do" class="btn_set refresh">새로고침</a>
    </p>

    <p id="conTitle" class="conTitle">
      <span>시험 문제 관리</span>
      <span class="fr">
        <input
          type="text"
          style="width: 200px; height: 25px"
          v-model="inputSearchQue"
          id="inputSearchQue"
          name="inputSearchQue"
          placeholder="문제 내용을 입력해주세요."
          onkeyup="if(event.keyCode == 13){fn_searchQue()}"
        />
        <a
          class="btnType blue"
          id="btnSearchQue"
          name="btn"
          @click="fn_searchQue()"
          style="margin: 0 10px"
          ><span>검 색</span></a
        >
        <a
          class="btnType blue"
          id="btnAddQue"
          name="btn"
          @click="CounselRegPopup('I')"
          ><span>문제 등록</span></a
        >
      </span>
    </p>

    <div id="divComGrpCodList">
      <table class="col">
        <caption>
          caption
        </caption>
        <colgroup>
          <col width="5%" />
          <col width="20%" />
          <col width="5%" />
          <col width="15%" />
          <col width="15%" />
          <col width="15%" />
          <col width="15%" />
          <col width="10%" />
        </colgroup>

        <thead>
          <tr>
            <th colspan="8">문제 목록</th>
          </tr>
          <tr>
            <th scope="col">문제 번호</th>
            <th scope="col">문제</th>
            <th scope="col">정답</th>
            <th scope="col">보기1</th>
            <th scope="col">보기2</th>
            <th scope="col">보기3</th>
            <th scope="col">보기4</th>
            <th scope="col"></th>
          </tr>
        </thead>

        <tbody v-for="item in itemList" :key="item.quest_seq">
          <tr>
            <td>{{ item.quest_seq }}</td>
            <td>{{ item.quest_qst }}</td>
            <td>{{ item.quest_ans }}</td>
            <td>{{ item.quest_one }}</td>
            <td>{{ item.quest_two }}</td>
            <td>{{ item.quest_three }}</td>
            <td>{{ item.quest_four }}</td>

            <!-- 관리자 페이지에서 시험이 등록되지 않은 경우 => 수정 가능함 -->
            <template v-if="item.quest_cnt == 'N'">
              <td>
                <a
                  @click="viewCounselDetails(item.quest_seq)"
                  id="btnSelectQue"
                  class="btnType blue"
                >
                  <span>수정</span></a
                >
              </td>
            </template>
            <template v-else>
              <td></td>
            </template>
          </tr>
        </tbody>
      </table>
    </div>
    <div id="lecPagination">
      <paginate
        class="justify-content-center"
        v-model="cpage"
        :page-count="totalPage"
        :page-range="5"
        :margin-pages="0"
        :click-handler="fn_queList"
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
import questionModal from './questionModal.vue';
import Paginate from 'vuejs-paginate-next';
import Swal from 'sweetalert2';

export default {
  data: function () {
    return {
      itemList: [],
      totalcnt: 0,
      cpage: 1,
      pageSize: 10,
      totalPage: 1,
      blocksize: 10,
      pagenavi: '',
      inputSearchQue: '',
      action: '',
      queSeq: 0,
      cnsseq: 0,
    };
  },
  components: {
    paginate: Paginate,
  },
  mounted() {
    this.fn_queList();
    this.emitter.on('result', () => {
      this.fn_queList();
    });
  },
  methods: {
    // 검색어
    fn_searchQue: function () {
      if (this.inputSearchQue == null || this.inputSearchQue == '') {
        // alert('검색어를 입력해주세요.');
        Swal.fire({
          title: '검색어를 입력해주세요.',
          icon: 'warning',
        });
      } else {
        console.log(this.inputSearchQue);
        this.fn_queList();
        //this.itemList = this.itemList.filter(item => item.quest_qst.indexOf(this.inputSearchQue) !== -1);
      }
    },
    // 리스트
    fn_queList: function () {
      let vm = this;
      console.log(this.pagenavi);

      let params = new URLSearchParams();
      params.append('pagenum', this.cpage);
      params.append('pageSize', this.pageSize);
      params.append('searchWord', this.inputSearchQue);

      console.log(this.cpage, this.pageSize, this.inputSearchQue);

      this.axios
        .post('/rq/vuequestionList.do', params)
        .then(function (response) {
          console.log(response);
          vm.totalcnt = response.data.totalcnt;
          vm.itemList = response.data.queList;
          vm.totalPage = vm.page(vm.totalcnt, vm.pageSize);
        })
        .catch(function (error) {
          alert('에러! API 요청에 오류가 있습니다. ' + error);
        });
    },
    page: function (total, page) {
      //   var total = this.totalcnt;
      //   var page = this.pageSize;
      var xx = total % page;
      var result = parseInt(total / page);

      if (xx == 0) {
        return result;
      } else {
        result = result + 1;
        return result;
      }
    },
    viewCounselDetails: function (cns_seq) {
      console.log(`cns_seq : ${cns_seq}`);
      this.cnsseq = cns_seq;
      this.CounselRegPopup('U');
    },
    CounselRegPopup: async function (action) {
      this.action = action;

      let paramtitle = '';
      let cnsseq = 0;

      console.log(paramtitle);

      if (action == 'I') {
        paramtitle = '상담 등록';
      } else {
        paramtitle = '수정';
        cnsseq = this.cnsseq;
      }

      const modal = await openModal(questionModal, {
        ptitle: paramtitle,
        pscnsseq: cnsseq,
        paction: this.action,
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
