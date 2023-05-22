<template>
  <div id="layer" class="layerPop layerType2" style="width: 600px">
    <dl>
      <dt>
        <strong>이력서</strong>
      </dt>
      <dd class="content">
        <!-- s : 여기에 내용입력 -->
        <table class="row" style="display: table; margin: auto;">
          <caption>
            caption
          </caption>
          <tbody>
            <tr>
              <th scope="row">한줄소개 <span class="font_red">*</span></th>
              <td colspan="3" style="width: 445px">
                <input
                  type="text"
                  class="inputTxt p100"
                  v-model="self"
                  name="self"
                  id="self"
                  readonly="readonly"
                />
              </td>
            </tr>
            <tr>
              <th scope="row">자기소개</th>
              <td colspan="3">
                <textarea
                  class="inputTxt p100"
                  v-model="selfone"
                  name="selfone"
                  id="selfone"
                  readonly="readonly"
                >
                </textarea>
              </td>
            </tr>
          </tbody>
        </table>

        <!-- e : 여기에 내용입력 -->

        <div class="btn_areaC mt30">
          <a
            href=""
            class="btnType gray"
            id="btnCloseresume"
            name="btn"
            @click.prevent="fn_close()"
            ><span>닫기</span></a
          >
        </div>
      </dd>
    </dl>
  </div>
</template>
<script>
import { closeModal } from 'jenesius-vue-modal';

export default {
  props: {
    rresseq: Number,
    rself: String,
    rselfone: String,
  },
  data: function () {
    return {
      resseq: '',
      self: '',
      selfone: '',
    };
  },
  mounted() {
    this.res_seq = this.rresseq;
    this.self = this.rself; //한줄소개
    this.selfone = this.rselfone; //자기소개

    console.log('~~~~~~~~~~~~~~~~~~~~~~');
    console.log(this.rresseq);
    console.log(this.rself);
    console.log(this.rselfone);
  },
  methods: {
    fn_close: function () {
      closeModal(this);
    },
  },
};
</script>
<style>
  /* table{display: table; margin: auto;} */
</style>
