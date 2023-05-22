<template>
  <form id="myForm" action="" method="">
    <div id="comnCodMgr">
      <p class="Location">
        <a href="/dashboard/home" class="btn_set home"></a>
        <span class="btn_nav bold">학습 관리</span>
        <span class="btn_nav bold">과제 제출</span>
      </p>
      <!-- 강의 목록 -->
      <p class="conTitle">
        <span>강의 목록</span>
      </p>
      <div id="submitList">
        <table class="col">
          <caption>
            caption
          </caption>
          <colgroup>
            <col width="15%" />
            <col width="25%" />
            <col width="20%" />
            <col width="25%" />
          </colgroup>

          <thead>
            <tr>
              <th scope="col">강의명</th>
              <th scope="col">강사명</th>
              <th scope="col">수강기간</th>
              <th scope="col">강의실</th>
            </tr>
          </thead>
          <tbody v-for="item in itemList" :key="item.loginID">
            <tr>
              <td>
                <a @click="lecclick(item.lec_seq)">{{ item.lec_name }}</a>
              </td>
              <td>{{ item.loginID }}</td>
              <td>{{ item.lec_st }}~{{ item.lec_ed }}</td>
              <td>{{ item.rm_name }}</td>
            </tr>
          </tbody>
        </table>
        <div id="lecPagination">
          <paginate
            class="justify-content-center"
            v-model="cpage"
            :page-count="totalPage"
            :page-range="8"
            :margin-pages="0"
            :click-handler="listSubmit"
            :prev-text="'Prev'"
            :next-text="'Next'"
            :container-class="'pagination'"
            :page-class="'page-item'"
          >
          </paginate>
        </div>
      </div>
      <br />

      <!-- 과제 제출 리스트 -->
      <p class="conTitle">
        <span>과제 제출</span>
      </p>
      <div id="taskList">
        <table class="col">
          <caption>
            caption
          </caption>
          <colgroup>
            <col width="10%" />
            <col width="15%" />
            <col width="7%" />
            <col width="5%" />
            <col width="15%" />
          </colgroup>

          <thead>
            <tr>
              <th scope="col">과제명</th>
              <th scope="col">과제내용</th>
              <th scope="col">제출기한</th>
              <th scope="col">제출여부</th>
              <th scope="col">첨부파일</th>
            </tr>
          </thead>
          <template v-if="tasktotalCnt === 0">
            <tbody id="tbodyTaskList">
              <tr>
                <td colspan="5">데이터가 존재하지 않습니다.</td>
              </tr>
            </tbody>
          </template>
          <template v-else>
            <tbody
              id="tbodyTaskList"
              v-for="item in taskItem"
              :key="item.task_name"
            >
              <tr>
                <td>{{ item.task_name }}</td>
                <td>{{ item.task_prob }}</td>
                <td>{{ item.task_ed }}</td>
                <td>{{ item.fileyn }}</td>
                <template v-if="item.file_name == null">
                  <td>
                    <input type="file" name="subfile" id="subfile" />
                    <a class="btnType3 color2" @click="fn_update(item.task_seq)"
                      ><span>제출</span></a
                    >
                  </td>
                </template>
                <template v-else>
                  <td>{{ item.file_name }}</td>
                </template>
              </tr>
            </tbody>
          </template>
        </table>
        <div id="lecPagination">
          <paginate 
            v-show="delflag"
            class="justify-content-center"
            v-model="taskcpage"  
            :page-count="taskpagenumsize"
            :page-range="5"
            :margin-pages="0"
            :click-handler="taskItemList"
            :prev-text="'Prev'"
            :next-text="'Next'"
            :container-class="'pagination'"
            :page-class="'page-item'"
          >
          </paginate>
        </div>
      </div>
    </div>
  </form>
</template>

<script>
import Paginate from 'vuejs-paginate-next';
import Swal from 'sweetalert2';

export default {
  data: function () {
    return {
      itemList: [], // 배열 형식으로 받아온다
      totalCnt: 0, // 총 몇개가 있는지
      cpage: 1, // 현재 페이지
      pageTotal: 8, // 한 페이지에 보여질 데이터 건수
      totalPage: 1,
      pagesize: 5, // 페이지 행 몇개씩?
      blocksize: 10, // 네비게이션으로 10개씩 나오게
      pagenavi: '',
      delflag: false,
      //tasklist
      action: 'I',
      taskseq: 0,
      taskItem: [], // 배열 형식으로 받아온다
      lecseq: 0,
      tasktotalCnt: 0, // 총 몇개가 있는지
      taskcpage: 1, // 현재 페이지
      taskpagesize: 5, // 페이지 행 몇개씩?
      taskpageTotal: 10, // 한 페이지에 보여질 데이터 건수
      taskpagenumsize: 0,
      taskblocksize: 10, // 네비게이션으로 10개씩 나오게
      taskpagenavi: '',
      subfile: '',
      previewhtml: '',
    };
  },
  components: {
    paginate: Paginate,
  },
  mounted() {
    this.listSubmit();
  },
  methods: {
    //강의실
    listSubmit: function () {
      let vm = this;
      console.log(this);

      let params = new URLSearchParams();
      params.append('pageNum', this.cpage);
      params.append('pageTotal', this.pageTotal);

      this.axios
        .post('/stu/vuesubmitListRow.do', params)
        .then(function (response) {
          console.log(response);
          vm.itemList = response.data.submitList;
          vm.totalcnt = response.data.taskCnt;
        })
        .catch(function (error) {
          alert('에러! API 요청에 오류가 있습니다. ' + error);
        });
    },
    // 클릭시 번호로 찾아가게끔
    lecclick: function (lec_seq) {
      this.lecseq = lec_seq;
      this.taskItemList();
    },
    //과제 제출
    taskItemList: function () {
      let vm = this;
      this.delflag = true;
      console.log(this.delflag);

      let params = new URLSearchParams();
      params.append('pageNum', this.taskcpage);
      params.append('pageTotal', this.taskpageTotal);
      params.append('lec_seq', this.lecseq);

      this.axios
        .post('/stu/vuetaskList.do', params)
        .then(function (response) {
          console.log(response);
          vm.taskItem = response.data.tasklist;
          vm.tasktotalCnt = response.data.taskCnt;
          // 총 몇개가 있는지   // 페이지 행 몇개씩?
          vm.taskpagenumsize = vm.page(vm.tasktotalCnt, vm.taskpageTotal);
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
    fn_update: function (task_seq) {
      let vm = this;

      this.taskseq = task_seq;

      let frm = document.getElementById('myForm'); // 파일 업로드 관리 될 form id 저장
      frm.enctype = 'multipart/form-data'; // form 타입 지정
      let dataWithFile = new FormData(frm); // FileUtilCho.jsp 에서 전달한 frm 파일명 & 경로 & 사이즈 나눠줌
      dataWithFile.append('action', this.action);
      dataWithFile.append('task_seq', this.taskseq);
      dataWithFile.append('file_seq', '');
      dataWithFile.append('uppagenum', '');
      dataWithFile.append('taskinfo_seq', '');
      dataWithFile.append('empty', 'empty');

      this.axios
        .post('/stu/updateInfo.do', dataWithFile)
        .then((resp) => {
          console.log(resp);
          if (resp.status == 200) {
            Swal.fire({
              title: '저장되었습니다.',
              icon: 'success',
            });
            console.log(dataWithFile);
          }
          vm.taskItemList();
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
};
</script>
