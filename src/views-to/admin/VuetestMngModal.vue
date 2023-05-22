<template>
  <div class="layerPop layerType2" style="width: 600px">
    <dl>
      <dt>
        <strong
          style="
            margin-left: 20px;
            font-size: 15px;
            line-height: 30px;
            color: white;
          "
          >시험 관리</strong
        >
      </dt>
      <dd class="content" style="margin-left: 20px">
        <!-- s : 여기에 내용입력  -->
        <div id="testnameall">
          <label style="font-size: 15px">시험명</label>
          <input
            type="text"
            id="detailname"
            name="detailname"
            v-model="detailname"
            style="margin-left: 10px; height: 25px"
          />
        </div>
        <br />
        <div class="tbl">
          <div class="seq" style="border: 1px solid #e5e5e5">
            <div>
              <span class="qsttitle">문항<br />번호</span>
            </div>
            <div
              v-for="(val, idx) in checkedList"
              :key="idx"
              style="border: 1px solid #e5e5e5"
            >
              <input
                type="radio"
                name="radio"
                :id="idx"
                :value="idx"
                v-model="checked"
              />
              <label :for="idx">{{ idx + 1 }}</label>
            </div>
          </div>
          <div class="val" style="border: 1px solid #e5e5e5">
            <div>
              <span class="qsttitle">문제<br />번호</span>
            </div>
            <div
              class="value"
              v-for="val in checkedList"
              :key="val"
              style="background-color: #fff; border: 1px solid #e5e5e5"
            >
              {{ val }}
            </div>
          </div>
        </div>
        <br />
        <select
          id="questselect"
          name="questselect"
          v-model="qseq"
          style="width: 80%"
        >
          <option value="">문항번호를 클릭 후 선택해주세요.</option>
          <template v-for="(qseq, index) in qseqlist" :key="index">
            <option :value="qseq">{{ qstlist[index] }}</option>
          </template>
        </select>
        <a class="btnType3 color3" @click="save()">
          <span>선택</span>
        </a>
        <!-- e : 여기에 내용입력  -->
        <div class="btn_areaC mt30">
          <a @click="testsave()" class="btnType blue"><span>저장</span></a>
          <a class="btnType gray" id="btnClosetest" name="btn" @click="close()"
            ><span>취소</span></a
          >
        </div>
      </dd>
    </dl>
  </div>
</template>

<script>
import { closeModal } from 'jenesius-vue-modal';
import Swal from 'sweetalert2';

export default {
  props: {
    ptitle: String,
    paction: String,
    ptestseq: Array,
    pdetailname: Array,
    select: Number,
  },
  data: function () {
    return {
      qseqlist: [],
      qstlist: [],
      qseq: '', // 선택된 문제
      checked: '', // 체크된 시퀀스
      checkedList: [], // 체크된 문제번호들
      detailname: '',
      action: '',
      testtype: '',
      testseq: '',
    };
  },
  mounted() {
    this.action = this.paction;

    if (this.paction == 'I') {
      console.log(this.paction);
      this.init();
    } else if (this.paction == 'U') {
      this.updateinit();
    } else {
      this.del();
    }
  },
  created: function () {
    this.checkedList = Array(10).fill(undefined);
  },
  methods: {
    init: function () {
      // 시험명 초기화
      this.detailname = '';

      // 문제 초기화
      this.checkedList = Array(10).fill(undefined);

      // select박스 초기화
      this.qseq = '';

      // radio 초기화
      const checked = document.querySelector('input[type=radio]:checked');
      checked && (checked.checked = false);

      this.initqstlist();
    },
    showmodal: function () {
      // 등록 시 모달 초기화
      this.paction === 'I' && this.init();
    },
    // 시험등록 질문리스트
    initqstlist: function () {
      let vm = this;
      console.log(this);
      this.axios
        .post('/admin/vueqslist.do')
        .then(function (res) {
          console.log(res);
          vm.qseqlist = res.data.qseqlist;
          vm.qstlist = res.data.qstlist;
        })
        .catch(function (error) {
          alert('에러! API 요청에 오류가 있습니다. ' + error);
        });
    },
    //선택 버튼
    save: function () {
      const a = [...this.checkedList].filter((e) => e === this.qseq);
      if (a.length === 0 && this.qseq !== '') {
        this.checkedList[this.checked] = this.qseq;
        this.$forceUpdate();
        this.qseq = '';
        return;
      }
      if (this.qseq == '') {
        Swal.fire({
          title: '문제를 선택해주세요.',
          icon: 'warning',
        });
      } else {
        Swal.fire({
          title: '선택된 문제입니다.',
          icon: 'warning',
        });
      }
    },
    // 저장 버튼
    testsave: function () {
      console.log(this.paction);
      if (!this.checkName()) {
        Swal.fire({
          title: '같은 시험명이 존재합니다.',
          icon: 'warning',
        });
        return;
      }
      if (this.paction !== 'D' && !this.checkMsg()) {
        return;
      }
      let vm = this;
      console.log(this);
      console.log(this.action);
      if (this.paction == 'I') {
        Swal.fire({
          title: '생성되었습니다.',
          icon: 'success',
        });
      } else if (this.action == 'U') {
        Swal.fire({
          title: '수정되었습니다.',
          icon: 'success',
        });
      } else {
        Swal.fire({
          title: '삭제되었습니다.',
          icon: 'success',
        });
      }
      this.action !== 'I' && (this.action = 'I');
      let params = new URLSearchParams();
      params.append('action', this.action);
      params.append('ptestseq', this.testtype);
      params.append('arr', this.checkedList.join(':'));
      params.append('detailname', this.detailname);

      this.axios
        .post('/admin/testSave.do', params)
        .then(function (res) {
          console.log(res);
          closeModal(vm);
          vm.emitter.emit('result', 'success');
        })
        .catch(function (error) {
          alert('에러! API 요청에 오류가 있습니다. ' + error);
        });
    },
    updateinit: function () {
      let vm = this;

      let params = new URLSearchParams();
      params.append('testtype', this.ptestseq);

      this.axios
        .post('/admin/testSelect.do', params)
        .then(function (res) {
          console.log(res);
          vm.action = 'U';
          vm.checkedList = res.data.testselect;
          vm.detailname = vm.pdetailname[vm.select - 1];
          vm.$forceUpdate();
          vm.showmodal();
        })
        .catch(function (error) {
          alert('에러! API 요청에 오류가 있습니다. ' + error);
        });
    },
    del: function () {
      this.action = 'D';
      if (!this.checkName()) {
        this.testsave();
      }
      closeModal();
    },
    checkMsg: function () {
      if (this.detailname === '') {
        Swal.fire({
          title: '시험명을 입력해 주세요.',
          icon: 'warning',
        });
        return false;
      }
      let result = this.checkedList.every((ele, idx) => {
        if (ele === undefined) {
          Swal.fire({
            title: idx + 1 + '번 문항을 선택해 주세요.',
            icon: 'warning',
          });
          return false;
        }
        return true;
      });

      return result;
    },
    checkName: function () {
      console.log(this.pdetailname);
      return this.pdetailname.every((e) => e !== this.detailname);
    },
    close: function () {
      let vm = this;
      closeModal(vm);
    },
  },
};
</script>

<style>
.qsttitle {
  font-weight: bold;
}

.tbl > div {
  display: flex;
  height: 40px;
  flex-direction: row;
}

.tbl > div > div:first-child {
  background-color: #92cf50 !important;
  text-align: center;
}

.tbl .seq > div {
  background-color: #bbc2cd !important;
}

.tbl .val > div:not(:first-child) {
  text-align: center;
  line-height: 40px;
  font-weight: bold;
}

.tbl > div > div {
  width: 50px;
  border: 1px solid white;
}

.tbl .seq input {
  display: none;
}

.tbl .seq label {
  display: inline-block;
  font-weight: bold;
  text-align: center;
  line-height: 40px;
  cursor: pointer;
  width: 100%;
  height: 100%;
}

input[type='radio']:checked + label {
  background-color: rgb(0, 103, 192);
  color: white;
}
</style>
