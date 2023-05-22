<template>
  <div>
    <div
      id="jobInsertModal"
      class="layerType2"
      style="width: 600px; position: initial"
    >
      <dl>
        <dt>
          <strong>회사명 입력</strong>
        </dt>
        <dd class="content">
          <table class="row">
            <caption>
              caption
            </caption>
            <colgroup>
              <col width="100px" />
              <col width="*" />
            </colgroup>
            <tbody>
              <tr>
                <th scope="row">회사명</th>
                <td>
                  <input
                    type="text"
                    class="inputTxt p100"
                    name="companyName"
                    id="companyName"
                    ref="companyName"
                  />
                </td>
              </tr>
            </tbody>
          </table>
          <div class="btn_areaC mt30">
            <a
              href=""
              class="btnType blue"
              id="btnSaveCompany"
              name="btnSaveCompany"
              v-on:click.prevent="saveCompany"
              ><span>저장</span></a
            >
            <a
              href=""
              class="btnType gray"
              id="btnClose"
              name="btn"
              @click.prevent="close"
              ><span>닫기</span></a
            >
          </div>
        </dd>
      </dl>
      <a href="" class="closePop" @click.prevent="close"
        ><span class="hidden">닫기</span></a
      >
    </div>
  </div>
</template>
<script setup>
import { closeModal } from 'jenesius-vue-modal';
import { getCurrentInstance, defineProps, ref, inject } from 'vue';

const $emitter = inject('$emitter');

const { proxy } = getCurrentInstance();

const companyName = ref(null);

const props = defineProps({
  loginID: {
    type: String,
    required: true,
  },
});

function saveCompany() {
  const params = new URLSearchParams();
  params.append('loginID', props.loginID);
  params.append('company', companyName.value.value);

  let checkitem = [
    { itemname: 'companyName', emptymsg: '회사명을 입력해 주세요!' },
  ];

  if (proxy.$songemptyValidation(checkitem)) {
    proxy.axios
      .post('/admin/saveCompany.do', params)
      .then((response) => {
        if (response.status == 200) {
          proxy.$swal('등록이 완료되었습니다.', '', 'success');
          $emitter.emit('result', '');
          close();
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }
}

function close() {
  closeModal();
}
</script>
<style lang="" scoped></style>
