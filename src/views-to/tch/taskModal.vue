<template>
  <div id="layer1" class="layerPop layerType2" style="width: 600px">
    <dl>
      <dt>
        <strong>과제 관리</strong>
      </dt>
      <dd class="content">
        <table class="row">
          <tbody>
            <tr>
              <th>과제명 <span class="font_red">*</span></th>
              <td>
                <input
                  type="text"
                  class="inputTxt p100"
                  name="taskname"
                  id="taskname"
                  v-model="taskname"
                />
              </td>
            </tr>
            <tr>
              <th>과제 내용 <span class="font_red">*</span></th>
              <td>
                <input
                  type="text"
                  class="inputTxt p100"
                  name="taskprob"
                  id="taskprob"
                  v-model="taskprob"
                />
              </td>
            </tr>
            <tr>
              <th>시작일자 <span class="font_red">*</span></th>
              <td>
                <input
                  type="date"
                  class="inputTxt p100"
                  name="taskst"
                  id="taskst"
                  :min="today"
                  v-model="taskst"
                />
              </td>
            </tr>
            <tr>
              <th>마감일자 <span class="font_red">*</span></th>
              <td>
                <input
                  type="date"
                  class="inputTxt p100"
                  name="tasked"
                  id="tasked"
                  v-model="tasked"
                />
              </td>
            </tr>
          </tbody>
        </table>
        <div class="btn_areaC mt30">
          <a
            href=""
            class="btnType blue"
            id="btnSavetask"
            name="btn"
            @click.prevent="tasksave()"
            ><span>저장</span></a
          >
          <a
            href=""
            @click.prevent="taskmodalclose()"
            class="btnType gray"
            id="btnClose"
            name="btn"
            ><span>취소</span></a
          >
        </div>
      </dd>
    </dl>
    <a href="" class="closePop" @click.prevent="taskmodalclose()"
      ><span class="hidden">닫기</span></a
    >
  </div>
</template>
<script>
import { closeModal } from 'jenesius-vue-modal';

export default {
  props: {
    mlecseq: Number,
    mtaskseq: Number,
    maction: String,
  },
  data: function () {
    return {
      lecseq: 0,
      taskseq: 0,
      taskname: '',
      taskprob: '',
      taskst: '',
      tasked: '',
      action: '',
      today: '',
    };
  },
  mounted() {
    this.action = this.maction;
    this.lecseq = this.mlecseq;
    console.log('modal seq : ' + this.mlecseq);

    if (this.action == 'I') {
      this.init();
    } else {
      this.taskseq = this.mtaskseq;
      this.selecttask();
    }
    this.dateLimit();

    console.log(this.action);
    console.log(this.taskseq);
  },
  methods: {
    taskmodalclose: function () {
      closeModal(this);
    },

    init: function (selectresult) {
      if (this.action == 'I') {
        this.taskname = '';
        this.taskprob = '';
        this.taskst = '';
        this.tasked = '';
      } else {
        this.taskname = selectresult.task_name;
        this.taskprob = selectresult.task_prob;
        this.taskst = selectresult.task_st;
        this.tasked = selectresult.task_ed;
        console.log(this.taskname);
        console.log(this.taskprob);
        console.log(this.taskst);
        console.log(this.tasked);
      }
    },
    selecttask: function () {
      let vm = this;

      let params = new URLSearchParams();

      params.append('taskinfoseq', this.taskseq);

      this.axios
        .post('/tch/taskSelect.do', params)
        .then(function (result) {
          vm.init(result.data.taskinfo);
          console.log(result);
        })
        .catch(function (error) {
          alert('오류오류오류' + error);
        });
    },
    tasksave: function () {
      console.log('modal seq2 : ' + this.lecseq);

      if (this.taskname == '') {
        this.$swal.fire({
          title: '과제명을 입력해 주세요.',
          icon: 'error',
          buttons: {
            confirm: {
              text: '확인',
              value: true,
              className: 'btn btn-outline-primary',
            },
          },
        });
        return;
      } else if (this.taskprob == '') {
        this.$swal.fire({
          title: '과제 내용을 입력해 주세요.',
          icon: 'error',
          buttons: {
            confirm: {
              text: '확인',
              value: true,
              className: 'btn btn-outline-primary',
            },
          },
        });
        return;
      } else if (this.taskst == '') {
        this.$swal.fire({
          title: '시작일자를 선택해 주세요.',
          icon: 'error',
          buttons: {
            confirm: {
              text: '확인',
              value: true,
              className: 'btn btn-outline-primary',
            },
          },
        });
        return;
      } else if (this.tasked == '') {
        this.$swal.fire({
          title: '마감일자를 선택해 주세요.',
          icon: 'error',
          buttons: {
            confirm: {
              text: '확인',
              value: true,
              className: 'btn btn-outline-primary',
            },
          },
        });
        return;
      }

      let params = new URLSearchParams();

      params.append('action', this.action);
      params.append('lecseq', this.lecseq);
      params.append('taskinfoseq', this.taskseq);
      params.append('taskname', this.taskname);
      params.append('taskprob', this.taskprob);
      params.append('taskst', this.taskst);
      params.append('tasked', this.tasked);

      this.axios
        .post('/tch/taskSave.do', params)
        .then((result) => {
          console.log(result);

          if (this.action == 'I') {
            this.$swal.fire({
              title: '생성되었습니다.',
              icon: 'success',
              buttons: {
                confirm: {
                  text: '확인',
                  value: true,
                  className: 'btn btn-outline-primary',
                },
              },
            });
          } else {
            this.$swal.fire({
              title: '수정되었습니다.',
              icon: 'success',
              buttons: {
                confirm: {
                  text: '확인',
                  value: true,
                  className: 'btn btn-outline-primary',
                },
              },
            });
          }
          closeModal(this);
        })
        .catch(function (error) {
          alert('에러! API 요청에 오류가 있습니다. ' + error);
        });
    },
    dateLimit: function () {
      let now_utc = Date.now();
      let timeOff = new Date().getTimezoneOffset() * 60000; // UTC 타임존 시간대, 우리나라 현재시간 차이나는 시간 계산
      let today = new Date(now_utc - timeOff).toISOString().split('T')[0]; // 내일 시간 - 시차 마이너스 후 문자 변환
      // T 문자 단위로 자른 후 2022-05-11 상태로 변환
      this.today = today;
    },
  },
};
</script>
<style>
#layer1 table {
  display: table;
  margin: auto;
}
#layer1 th {
  width: 20%;
}
#layer1 td {
  width: 80%;
}
</style>
