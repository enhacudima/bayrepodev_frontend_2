
<template>
  <div>
    <a-modal
      :title="titleModal"
      :open="visibleModal"
      @ok="handleOk"
      :confirmLoading="confirmLoading"
      @cancel="handleCancel"
    >
      <!--  <D3LineChart :config="chart_config" :datum="chart_data"></D3LineChart> -->
      <a-list
        class="comment-list"
        item-layout="horizontal"
        :data-source="notificacoesModal.data"
        :header="`${
          notificacoesModal.data != undefined ? notificacoesModal.data.length : 0
        } replies`"
      >
        <template #renderItem="{ item }">
          <a-list-item>
            <a-skeleton :loading="loading" active avatar>
              <a-comment
                :author="item.name + '' + item.last_name"
                :avatar="$baseUrl + 'storage/uploads/avatars/' + item.avatar"
              >
                <template #content>
                  <p v-if="item.cliente_name">
                    Nome: <i>{{ item.cliente_name }}</i>
                  </p>
                  <p v-if="item.cliente_cell">
                    Contacto: <i>{{ item.cliente_cell }}</i>
                  </p>
                  <p v-if="item.cliente_nuit">
                    Nuit: <i>{{ item.cliente_nuit }}</i>
                  </p>
                </template>
                <template #datetime>
                  <a-tooltip :title="formatDate(item.data_visita)">
                    <span>{{ dateFromNow(item.data_visita) }}</span>
                  </a-tooltip>
                </template>
              </a-comment>
            </a-skeleton>
          </a-list-item>
        </template>
      </a-list>
    </a-modal>
    <a-modal
      title="Adicionar Manualmente Novo Cliente"
      :open="visibleModalPlus"
      @ok="handleSubmitPlus"
      :confirmLoading="confirmLoading"
      @cancel="handleCancelCM"
    >
      <a-form
        :model="formPlus"
        name="formPlus"
        autocomplete="off"
        ref="formPlusRef"
        v-bind="formItemLayout"
      >
        <a-form-item style="display: none" name="table_name">
          <a-input
            type="hidden"
            name="table_name"
            v-model:value="formPlus.keywords"
            :value="keywords"
          />
        </a-form-item>
        <a-form-item
          label="Nome"
          name="cliente_name"
          :rules="[{ required: true, message: 'Please input Cliente name!!' }]"
        >
          <a-input placeholder="João XXXX" v-model:value="formPlus.cliente_name" />
        </a-form-item>
        <a-form-item
          label="Nuit"
          name="cliente_nuit"
          :rules="[{ required: true, message: 'Please input Cliente NUIT!!' }]"
        >
          <a-input-number
            placeholder="12XXXXXX9"
            v-model:value="formPlus.cliente_nuit"
            style="width: 100%"
          />
        </a-form-item>
        <a-form-item
          label="Cell"
          name="cliente_cell"
          :rules="[{ required: true, message: 'Please input Cliente phone number!!' }]"
        >
          <a-input-number
            placeholder="84XXXXXXX"
            v-model:value="formPlus.cliente_cell"
            style="width: 100%"
          />
        </a-form-item>
      </a-form>
    </a-modal>

    <a-card title="Campanha" :style="{ marginBottom: '24px' }">
      <a-row>
        <a-col :span="9">
          <a-select
            v-model.lazy="keywords"
            ref="campanhas"
            v-model:value="keywords"
            style="width: 100%"
            :options="optionsCampains"
            @focus="true"
          ></a-select>
        </a-col>
        <a-col :span="2">
          <a-switch
            v-if="!meus"
            style="margin: 5px 15px 0px"
            checkedChildren="Todos"
            unCheckedChildren="Meus"
            v-model:checked="switchMeus"
            @change="onChangeMeus"
          />
        </a-col>
      </a-row>
    </a-card>
    <div>
      <a-card :loading="meus" title="Opcções">
        <a-row>
          <!--
                    <a-col :span="9">
                        <div class="input-group" style="width: 100%">
                          <input   class="form-control"  required autofocus  v-model.lazy="search" placeholder="Search by NUIT, Phone, Name, bulck.." :class="{ 'loading-circle' : autoCompleteProgress, 'hide-loading-circle': !autoCompleteProgress }">
                              <span class="input-group-btn">
                                <button type="submit" name="search" id="search-btn" class="btn btn-flat" @click="fetch('getDataToTableSearch',keywords,search)"><i class="fa fa-search"></i>
                                </button>
                              </span>
                        </div>
                    </a-col>
                    -->

          <a-button style="margin: 0px 5px 0px" type="primary" @click="showModal" :disabled="meus">
            <template #icon>
              <bell-outlined />
            </template>
          </a-button>

          <a-popover title="Export Full Results">
            <template #content>
              <p><OrderedListOutlined /> With Baylend last loan</p>
              <p><ClockCircleOutlined /> Take more time</p>
              <p><LinkOutlined /> Please ask IT support for API link</p>
            </template>
            <a-button
              style="margin: 0px 5px 0px"
              type="primary"
              :disabled="meus"
              @click="exportTeleSales"
            >
              <template #icon>
                <cloud-download-outlined />
              </template>
            </a-button>
          </a-popover>

          <a-popover title="Quick Export Results">
            <template #content>
              <p><ClockCircleOutlined /> Faster way</p>
              <p><LinkOutlined /> Please ask IT support for API link</p>
            </template>
            <a-button
              style="margin: 0px 5px 0px"
              type="primary"
              :disabled="meus"
              @click="exportTeleSalesSmple"
            >
              <template #icon>
                <DownloadOutlined />
              </template>
            </a-button>
          </a-popover>

          <a-button style="margin: 0px 5px 0px" type="primary" :disabled="meus" @click="plusClient">
            <template #icon>
              <plus-outlined />
            </template>
          </a-button>
          <a-button
            style="margin: 0px 5px 0px"
            type="primary"
            :loading="meus"
            @click="fetch('/v1/getDataToTable', keywords)"
          >
            <template #icon>
              <reload-outlined />
            </template>
          </a-button>
        </a-row>
      </a-card>
    </div>
    <br />
    <div style="margin-bottom: 20px">
      <a-card :loading="loading" title="Resultados">
        <div v-if="columns">
          <v-server-table :url="url + keywords" :columns="columns" :options="options">
            <template v-slot:id="props">
              <a-button type="primary" :loading="loading" @click="onRowClick(props)">
                <template #icon><EyeOutlined /></template>
                {{ props.row.id }}
              </a-button>
            </template>
            <template v-slot:data_files="props">
              <div v-if="toJson(props.row.data_files) == false">
                <a-tag @click="doCopy(props.row.data_files.toString())" color="success">
                  <template #icon>
                    <CopyOutlined />
                  </template>
                  {{ props.row.data_files.toString() }}
                </a-tag>
              </div>
              <div v-else>
                <template v-for="(item, key) in JSON.parse(props.row.data_files)" :key="key">
                  <a-tag
                    @click="doCopy(item)"
                    v-if="
                      (item.substring(item.lastIndexOf('.') + 1) == 'jpeg') |
                        (item.substring(item.lastIndexOf('.') + 1) == 'jpg') |
                        (item.substring(item.lastIndexOf('.') + 1) == 'png') |
                        (item.substring(item.lastIndexOf('.') + 1) == 'webp')
                    "
                    color="success"
                  >
                    <template #icon>
                      <CopyOutlined />
                    </template>
                    {{ ++key }} - {{ item.substring(item.lastIndexOf('/') + 1) }}
                  </a-tag>
                  <a :href="item" target="_blank" v-else>
                    <a-tag color="success">
                      <template #icon>
                        <LinkOutlined />
                      </template>
                      {{ ++key }} - {{ item.substring(item.lastIndexOf('/') + 1) }}
                    </a-tag>
                  </a>
                </template>
              </div>
            </template>
          </v-server-table>
        </div>
      </a-card>
    </div>
    <div>
      <a-drawer
        :title="title"
        :width="900"
        placement="right"
        :closable="false"
        @close="onClose"
        :open="draw"
        :zIndex="1050"
      >
        <a-list
          item-layout="horizontal"
          :data-source="thisLine.TeleSalesAnalytic"
          :header="`${
            thisLine.TeleSalesAnalytic != undefined ? thisLine.TeleSalesAnalytic.length : 0
          } Estado actual`"
        >
          <template #renderItem="{ item }">
            <a-list-item>
              <a-skeleton :loading="loading" active avatar>
                <a-list-item-meta
                  :description="
                    item.resultados
                      ? item.resultados.estado_venda
                      : ' ' + ', ' + dateFromNow(item.updated_at)
                  "
                >
                  <template #title>
                    <a :href="$baseUrl">By {{ item.users.name + ' ' + item.users.lname }}</a>
                  </template>
                  <template #avatar>
                    <a-avatar :src="$baseUrl + 'storage/uploads/avatars/' + item.users.avatar" />
                  </template>
                </a-list-item-meta>
              </a-skeleton>
            </a-list-item>
          </template>
        </a-list>

        <a-tabs defaultActiveKey="1" @change="handleSearchLine(line_id, bulck, table)">
          <a-tab-pane tab="Add" key="1">
            <a-timeline>
              <a-timeline-item>
                <h5>Agente</h5>
                <a-form
                  :model="formAgente"
                  name="formAgente"
                  ref="formAgenteRef"
                  v-bind="formItemLayout"
                >
                  <!--initial values-->
                  <a-form-item style="display: none" name="table_name">
                    <a-input type="hidden" name="table_name" v-model:value="formAgente.keywords" />
                  </a-form-item>
                  <a-form-item style="display: none" name="bulck">
                    <a-input type="hidden" name="bulck" v-model:value="formAgente.bulck" />
                  </a-form-item>
                  <a-form-item style="display: none" name="line_id">
                    <a-input type="hidden" name="line_id" v-model:value="formAgente.line_id" />
                  </a-form-item>
                  <!--end initial values-->

                  <a-form-item
                    :label-col="formItemLayout.labelCol"
                    :wrapper-col="formItemLayout.wrapperCol"
                    label="Agente"
                    :rules="[{ required: true, message: 'Please input agent!!' }]"
                    name="agente"
                  >
                    <a-select
                      show-search
                      placeholder="Pesquise o agente"
                      name="agente"
                      v-model:value="formAgente.agente"
                      optionFilterProp="children"
                      @search="handleSearch"
                      @change="handleSearch"
                      :options="agentes"
                      :default-active-first-option="false"
                      :show-arrow="false"
                      :filter-option="false"
                      :not-found-content="null"
                      allowClear
                    >
                    </a-select>
                  </a-form-item>

                  <a-form-item
                    :label-col="formItemLayout.labelCol"
                    :wrapper-col="formItemLayout.wrapperCol"
                    label="Agencia"
                    :rules="[{ required: true, message: 'Please input agencia!!' }]"
                    name="agencia"
                  >
                    <a-select
                      placeholder="Pesquise o agente"
                      name="agencia"
                      v-model:value="formAgente.agencia"
                      :options="agencias"
                      :default-active-first-option="false"
                      :show-arrow="false"
                      :filter-option="false"
                      :not-found-content="null"
                      allowClear
                    >
                    </a-select>
                  </a-form-item>
                  <a-form-item
                    :label-col="formItemLayout.labelCol"
                    :wrapper-col="formItemLayout.wrapperCol"
                    label="Provincia"
                    :rules="[
                      {
                        required: false
                      }
                    ]"
                    name="province"
                  >
                    <a-select
                      name="province"
                      placeholder="Seleciona opção abaixo"
                      v-model:value="formChamadas.province"
                    >
                      <a-select-option value="Cabo Delgado"> Cabo Delgado </a-select-option>
                      <a-select-option value="Gaza"> Gaza </a-select-option>
                      <a-select-option value="Inhambane"> Inhambane </a-select-option>
                      <a-select-option value="Manica"> Manica </a-select-option>
                      <a-select-option value="Maputo City"> Maputo City </a-select-option>
                      <a-select-option value="Maputo"> Maputo </a-select-option>
                      <a-select-option value="Nampula"> Nampula </a-select-option>
                      <a-select-option value="Niassa"> Niassa </a-select-option>
                      <a-select-option value="Sofala"> Sofala </a-select-option>
                      <a-select-option value="Tete"> Tete </a-select-option>
                      <a-select-option value="Zambezia"> Zambezia </a-select-option>
                    </a-select>
                  </a-form-item>
                  <a-form-item
                    :label-col="formItemLayout.labelCol"
                    :wrapper-col="formItemLayout.wrapperCol"
                    label="District"
                    name="district"
                  >
                    <a-input name="district" v-model:value="formAgente.district" />
                  </a-form-item>

                  <a-form-item
                    :label-col="formItemLayout.labelCol"
                    :wrapper-col="formItemLayout.wrapperCol"
                  >
                    <a-button type="primary" @click="handleSubmitAgente"> Submit </a-button>
                  </a-form-item>
                </a-form>
              </a-timeline-item>

              <a-timeline-item>
                <h5>Chamadas</h5>
                <a-form
                  :model="formChamadas"
                  name="formAgente"
                  ref="formChamadasRef"
                  v-bind="formItemLayout"
                >
                  <!--initial values-->
                  <a-form-item style="display: none" name="table_name">
                    <a-input
                      type="hidden"
                      name="table_name"
                      v-model:value="formChamadas.keywords"
                    />
                  </a-form-item>
                  <a-form-item style="display: none" name="bulck">
                    <a-input type="hidden" name="bulck" v-model:value="formChamadas.bulck" />
                  </a-form-item>
                  <a-form-item style="display: none" name="line_id">
                    <a-input type="hidden" name="line_id" v-model:value="formChamadas.line_id" />
                  </a-form-item>
                  <!--end initial values-->

                  <a-form-item
                    label="Duração"
                    :rules="[{ required: true, message: 'Please input a Time!' }]"
                    name="time"
                  >
                    <a-range-picker
                      name="time"
                      :showTime="{ format: 'HH:mm' }"
                      format="YYYY-MM-DD HH:mm"
                      :placeholder="['Start Time', 'End Time']"
                      v-model:value="formChamadas.time"
                    />
                  </a-form-item>
                  <a-form-item
                    label="Resultado"
                    :rules="[
                      {
                        required: true,
                        message: 'Seleciona resultado!'
                      }
                    ]"
                    name="resultado"
                  >
                    <a-select
                      name="resultado"
                      placeholder="Seleciona opção abaixo"
                      v-model:value="formChamadas.resultado"
                    >
                      <a-select-option value="Sucesso"> Sucesso </a-select-option>
                      <a-select-option value="Nr ocupado"> Nr ocupado </a-select-option>
                      <a-select-option value="Nr desligado"> Nr desligado </a-select-option>
                      <a-select-option value="Nr n pertence ao clt">
                        Nr n pertence ao clt
                      </a-select-option>
                      <a-select-option value="Nao atende"> Nao atende </a-select-option>
                      <a-select-option value="Nr invalido"> Nr invalido </a-select-option>
                    </a-select>
                  </a-form-item>
                  <a-form-item
                    label="Disponibilidade"
                    :rules="[{ required: true, message: 'Seleciona a disponibilidade!' }]"
                    name="disponibilidade"
                  >
                    <a-select
                      name="disponibilidade"
                      placeholder="Seleciona opção abaixo"
                      v-model:value="formChamadas.disponibilidade"
                    >
                      <a-select-option value="Sim"> Sim </a-select-option>
                      <a-select-option value="Nao, indisponivel">
                        Nao, indisponivel
                      </a-select-option>
                      <a-select-option value="Nao, ligar mas tarde">
                        Nao, ligar mas tarde
                      </a-select-option>
                    </a-select>
                  </a-form-item>
                  <a-form-item
                    label="Comentario"
                    :rules="[
                      { required: false, message: 'Por favor descreva o resultado de chamada' }
                    ]"
                    name="comentario"
                    v-model:value="formChamadas.comentario"
                  >
                    <a-textarea name="comentario" placeholder="Resultado da chamada" :rows="4" />
                  </a-form-item>
                  <a-form-item
                    :label-col="formItemLayout.labelCol"
                    :wrapper-col="formItemLayout.wrapperCol"
                  >
                    <a-button type="primary" @click="handleSubmitChamadas"> Submit </a-button>
                  </a-form-item>
                </a-form>
              </a-timeline-item>

              <a-timeline-item>
                <h5>Resultado da venda</h5>
                <a-form
                  :model="formResultado"
                  name="formResultado"
                  ref="formResultadoRef"
                  v-bind="formItemLayout"
                >
                  <!--initial values-->
                  <a-form-item style="display: none" name="table_name">
                    <a-input
                      type="hidden"
                      name="table_name"
                      v-model:value="formResultado.keywords"
                    />
                  </a-form-item>
                  <a-form-item style="display: none" name="bulck">
                    <a-input type="hidden" name="bulck" v-model:value="formResultado.bulck" />
                  </a-form-item>
                  <a-form-item style="display: none" name="line_id">
                    <a-input type="hidden" name="line_id" v-model:value="formResultado.line_id" />
                  </a-form-item>
                  <!--end initial values-->

                  <a-form-item
                    label="Estado"
                    :rules="[{ required: true, message: 'Seleciona Estado!' }]"
                    name="estado_venda"
                  >
                    <a-select
                      placeholder="Seleciona opção abaixo"
                      name="estado_venda"
                      v-model:value="formResultado.estado_venda"
                      @change="handleChange"
                    >
                      <a-select-option value="Nao esta interessado">
                        Nao esta interessado
                      </a-select-option>
                      <a-select-option value="Agente enviado para finalizar a venda">
                        Agente enviado ara finalizar a venda
                      </a-select-option>
                      <a-select-option
                        value="Agente enviado para esclarecimentos adicionais e finalizacao da venda"
                      >
                        Agente enviado para esclarecimentos adicionais e finalizacao da venda
                      </a-select-option>
                      <a-select-option value="Pretende pensar"> Pretende pensar </a-select-option>
                      <a-select-option value="Vai reunir os documentos e dira algo">
                        Vai reunir os documentos e dira algo
                      </a-select-option>
                      <a-select-option value="Ligar mais tarde"> Ligar mais tarde </a-select-option>
                      <a-select-option value="Taxa/prestacao alta">
                        Taxa/prestacao alta
                      </a-select-option>
                      <a-select-option value="Valor baixo"> Valor baixo </a-select-option>
                      <a-select-option value="Venda consumada"> Venda consumada </a-select-option>
                      <a-select-option value="Desistencia"> Desistencia </a-select-option>
                      <a-select-option value="Valor desembolsado">
                        Valor desembolsado
                      </a-select-option>
                      <a-select-option value="Idade de reforma"> Idade de reforma </a-select-option>
                      <a-select-option value="Atribuido a agencia">
                        Atribuido a agencia
                      </a-select-option>
                      <a-select-option value="Nr n pertence ao clt">
                        Nr n pertence ao clt
                      </a-select-option>
                      <a-select-option value="Confirmado"> Confirmado </a-select-option>
                      <a-select-option value="Nao Confirmado"> Nao Confirmado </a-select-option>
                      <a-select-option value="Entidade Bloqueada">
                        Entidade Bloqueada
                      </a-select-option>
                      <a-select-option value="Financiamento ja feito">
                        Financiamento ja feito
                      </a-select-option>
                      <a-select-option value="Barramento de chamadas">
                        Barramento de chamadas
                      </a-select-option>
                      <a-select-option value="Dois financiamento activos">
                        Dois financiamento activos
                      </a-select-option>
                      <a-select-option value="Sem Capacidade"> Sem Capacidade; </a-select-option
                      ><a-select-option value="Nao e funcionario Publico">
                        Nao e funcionario Publico
                      </a-select-option>
                      <a-select-option value="Pretende ir ao agencia">
                        Pretende ir ao agencia
                      </a-select-option>
                      <a-select-option value="Documento enviado e actualizado">
                        Documento enviado e actualizado
                      </a-select-option>
                      <a-select-option value="Aguardando documento">
                        Aguardando documento
                      </a-select-option>
                      <a-select-option value="Nao dispoe de documento actualizado">
                        Nao dispoe de documento actualizado
                      </a-select-option>
                    </a-select>
                  </a-form-item>
                  <a-form-item
                    label="Tipo de venda"
                    :rules="[{ required: checkTipoVenda, message: 'Seleciona tipo de venda!' }]"
                    name="tipo_venda"
                  >
                    <a-select
                      placeholder="Seleciona opção abaixo"
                      name="tipo_venda"
                      v-model:value="formResultado.tipo_venda"
                    >
                      <a-select-option value="New deal"> New deal </a-select-option>
                      <a-select-option value="topUp"> topUp </a-select-option>
                      <a-select-option value="Retencao"> Retencao </a-select-option>
                    </a-select>
                  </a-form-item>
                  <a-form-item
                    label="OIC"
                    name="oic"
                    :rules="[{ required: checkOIC, message: 'Seleciona OIC!' }]"
                  >
                    <a-select
                      name="oic"
                      v-model:value="formResultado.oic"
                      placeholder="Seleciona opção abaixo"
                      @change="handleChangeOIC"
                    >
                      <a-select-option value="Sim"> Sim </a-select-option>
                      <a-select-option value="Nao"> Nao </a-select-option>
                    </a-select>
                  </a-form-item>
                  <a-form-item
                    :rules="[{ required: checkOICDetalhes, message: ' OIC!' }]"
                    label="OIC Detalhes"
                    name="oic_detalhe"
                  >
                    <a-input
                      placeholder="OIC Detalhes"
                      name="oic_detalhe"
                      v-model:value="formResultado.oic_detalhe"
                    />
                  </a-form-item>
                  <a-form-item
                    label="Na fonte"
                    name="retencao_fonte"
                    :rules="[{ required: checkFonte, message: 'Seleciona Fonte!' }]"
                  >
                    <a-select
                      name="retencao_fonte"
                      v-model:value="formResultado.retencao_fonte"
                      placeholder="Seleciona opção abaixo"
                    >
                      <a-select-option value="Sim"> Sim </a-select-option>
                      <a-select-option value="Nao"> Nao </a-select-option>
                    </a-select>
                  </a-form-item>

                  <a-form-item
                    name="valor_proposto"
                    :rules="[
                      { required: checkValorProposto, message: ' Escreva o valor proposto!' }
                    ]"
                    label="Valor Proposto"
                  >
                    <a-input-number
                      placeholder="Valor proposto"
                      step="any"
                      name="valor_proposto"
                      v-model:value="formResultado.valor_proposto"
                      style="width: 100%"
                    />
                  </a-form-item>

                  <a-form-item
                    name="prestacao"
                    label="Prestação"
                    :rules="[
                      { required: checkPrestacao, message: 'Diga qual é o Prazo de financiamento!' }
                    ]"
                  >
                    <a-input-number
                      placeholder="Prestação"
                      step="any"
                      name="prestacao"
                      v-model:value="formResultado.prestacao"
                      style="width: 100%"
                    />
                  </a-form-item>
                  <a-form-item
                    name="prazo_vencimento"
                    :rules="[
                      { required: checkPrazo, message: 'Diga qual é o Prazo de financiamento!' }
                    ]"
                    label="Prazo"
                  >
                    <a-input-number
                      placeholder="Prazo"
                      name="prazo_vencimento"
                      v-model:value="formResultado.prazo_vencimento"
                      style="width: 100%"
                    />
                  </a-form-item>
                  <a-form-item
                    name="data_visita"
                    label="Data da Visita"
                    :rules="[{ required: checkData, message: 'Data da visita!' }]"
                  >
                    <a-date-picker
                      name="data_visita"
                      showTime
                      v-model:value="formResultado.data_visita"
                    />
                  </a-form-item>
                  <a-form-item
                    label="Comentário"
                    name="comentario"
                    :rules="[
                      {
                        required: false,
                        message: 'Por favor descreva o resultado de chamada adiciona um comentario'
                      }
                    ]"
                  >
                    <a-textarea
                      name="comentario"
                      v-model:value="formResultado.comentario"
                      placeholder="Comentário"
                      :rows="4"
                    />
                  </a-form-item>
                  <a-row>
                    <a-form-item
                      :label-col="formItemLayout.labelCol"
                      :wrapper-col="formItemLayout.wrapperCol"
                    >
                      <a-button type="primary" @click="handleSubmitresultado"> Submit </a-button>
                    </a-form-item>
                  </a-row>
                </a-form>
              </a-timeline-item>
              <a-timeline-item>
                <h5>Usuario</h5>
                <a-form :model="formDono" name="formDono" ref="formDonoRef" v-bind="formItemLayout">
                  <!--initial values-->
                  <a-form-item style="display: none" name="table_name">
                    <a-input type="hidden" name="table_name" v-model:value="formDono.keywords" />
                  </a-form-item>
                  <a-form-item style="display: none" name="bulck">
                    <a-input type="hidden" name="bulck" v-model:value="formDono.bulck" />
                  </a-form-item>
                  <a-form-item style="display: none" name="line_id">
                    <a-input type="hidden" name="line_id" v-model:value="formDono.line_id" />
                  </a-form-item>
                  <!--end initial values-->

                  <a-form-item
                    label="Nome"
                    :rules="[{ required: true, message: 'Seleciona resultado!' }]"
                    name="user"
                  >
                    <div class="global-search-wrapper">
                      <a-select
                        show-search
                        placeholder="Pesquise o Usuario"
                        name="user"
                        v-model:value="formDono.user"
                        optionFilterProp="children"
                        @search="handleUsers"
                        @change="handleUsers"
                        :options="users"
                        :default-active-first-option="false"
                        :show-arrow="false"
                        :filter-option="false"
                        :not-found-content="null"
                        allowClear
                      >
                      </a-select>
                    </div>
                  </a-form-item>
                  <a-row>
                    <a-form-item
                      :label-col="formItemLayout.labelCol"
                      :wrapper-col="formItemLayout.wrapperCol"
                    >
                      <a-button type="primary" @click="handleSubmitDono"> Submit </a-button>
                    </a-form-item>
                  </a-row>
                </a-form>
              </a-timeline-item>
              <a-timeline-item> </a-timeline-item>
            </a-timeline>
          </a-tab-pane>
          <a-tab-pane tab="Full view" key="2">
            <a-timeline>
              <a-timeline-item>
                <h5>Agente</h5>
                <a-list
                  class="comment-list"
                  item-layout="horizontal"
                  :data-source="thisLine.TeleSalesAgente"
                  :header="`${
                    thisLine.TeleSalesAgente != undefined ? thisLine.TeleSalesAgente.length : 0
                  }  replies`"
                >
                  <template #renderItem="{ item }">
                    <a-list-item>
                      <a-skeleton :loading="loadingLine" v-if="!loadingLine" active avatar>
                        <a-comment
                          :author="item.users.name + '' + item.users.lname"
                          :avatar="$baseUrl + 'storage/uploads/avatars/' + item.users.avatar"
                        >
                          <template #content>
                            <p>
                              Agente:
                              <i
                                >{{ item.agents.ConsultantFirstNames }}
                                {{ item.agents.ConsultantSurname }}</i
                              >
                              {{ item.agents.ConsultantManagerOutlet }}
                            </p>
                            <p>
                              Agencia:
                              <i>{{ item.agencias.outletSyncNameCorrected }}</i>
                            </p>
                          </template>
                          <template #datetime>
                            <a-tooltip :title="formatDate(item.created_at)">
                              <span>{{ dateFromNow(item.created_at) }}</span>
                            </a-tooltip>
                          </template>
                        </a-comment>
                      </a-skeleton>
                    </a-list-item>
                  </template>
                </a-list>
              </a-timeline-item>
              <a-timeline-item>
                <h5>Chamadas</h5>
                <a-list
                  class="comment-list"
                  item-layout="horizontal"
                  :data-source="thisLine.TeleSalesChamadas"
                  :header="`${
                    thisLine.TeleSalesChamadas != undefined ? thisLine.TeleSalesChamadas.length : 0
                  } manual replies`"
                >
                  <template #renderItem="{ item }">
                    <a-list-item>
                      <a-skeleton :loading="loading" active avatar>
                        <a-comment
                          :author="item.users.name + '' + item.users.lname"
                          :avatar="$baseUrl + 'storage/uploads/avatars/' + item.users.avatar"
                        >
                          <template #content>
                            <p>
                              Start: <i>{{ item.start }}</i>
                            </p>
                            <p>
                              End: <i>{{ item.end }}</i>
                            </p>
                            <p>
                              Duração de Chamada:
                              <i>{{ formatDate(item.start) }} {{ formatDate(item.end) }}</i>
                            </p>
                            <p>
                              Resultado: <i>{{ item.resultado }}</i>
                            </p>
                            <p>
                              Disponibilidade: <i>{{ item.disponibilidade }}</i>
                            </p>
                            <p>
                              Comentário: <i>{{ item.comentario }}</i>
                            </p>
                          </template>
                          <template #datetime>
                            <a-tooltip :title="formatDate(item.created_at)">
                              <span>{{ dateFromNow(item.created_at) }}</span>
                            </a-tooltip>
                          </template>
                        </a-comment>
                      </a-skeleton>
                    </a-list-item>
                  </template>
                </a-list>
              </a-timeline-item>

              <a-timeline-item>
                <h5>Chamadas PBX</h5>
                <a-list
                  class="comment-list"
                  item-layout="horizontal"
                  :data-source="thisLine.TeleSalesChamadasAutomatic"
                  :header="`${
                    thisLine.TeleSalesChamadasAutomatic != undefined
                      ? thisLine.TeleSalesChamadasAutomatic.length
                      : 0
                  } automatic replies`"
                >
                  <template #renderItem="{ item }">
                    <a-list-item>
                      <a-skeleton :loading="loading" active avatar>
                        <a-comment
                          author="PBX"
                          :avatar="$baseUrl + 'storage/uploads/avatars/default.jpg'"
                        >
                          <template #content>
                            <p>
                              Channel: <i>{{ item.channel }}</i>
                            </p>
                            <p>
                              Start: <i>{{ item.calldate }}</i>
                            </p>
                            <p>
                              Duração de Chamada: <i>{{ item.duration }} seconds</i>
                            </p>
                            <p>
                              Resultado: <i>{{ item.disposition }}</i>
                            </p>
                            <p>
                              Destination: <i>{{ item.dst }}</i>
                            </p>
                          </template>
                          <template #datetime>
                            <a-tooltip :title="formatDate(item.calldate)">
                              <span>{{ dateFromNow(item.calldate) }}</span>
                            </a-tooltip>
                          </template>
                        </a-comment>
                      </a-skeleton>
                    </a-list-item>
                  </template>
                </a-list>
              </a-timeline-item>

              <a-timeline-item>
                <h5>SMS & EMail</h5>
                <a-list
                  class="comment-list"
                  item-layout="horizontal"
                  :data-source="thisLine.TeleSalesSMSEmsial"
                  :header="`${
                    thisLine.TeleSalesSMSEmsial != undefined
                      ? thisLine.TeleSalesSMSEmsial.length
                      : 0
                  } SMS & Email`"
                >
                  <template #renderItem="{ item }">
                    <a-list-item>
                      <a-skeleton :loading="loading" active avatar>
                        <a-comment
                          :author="'System'"
                          :avatar="$baseUrl + 'storage/uploads/avatars/default.jpg'"
                        >
                          <template #content>
                            <p>
                              Code: <i>{{ item.code }}</i>
                            </p>
                            <p>
                              Comment: <i>{{ item.comment }}</i>
                            </p>
                            <p>
                              On: <i>{{ item.type }}</i>
                            </p>
                            <p>
                              Via: <i>{{ item.via }}</i>
                            </p>
                          </template>
                          <template #datetime>
                            <a-tooltip :title="formatDate(item.updated_at)">
                              <span>{{ dateFromNow(item.updated_at) }}</span>
                            </a-tooltip>
                          </template>
                        </a-comment>
                      </a-skeleton>
                    </a-list-item>
                  </template>
                </a-list>
              </a-timeline-item>
              <a-timeline-item>
                <h5>Resultado da Venda</h5>
                <a-list
                  class="comment-list"
                  item-layout="horizontal"
                  :data-source="thisLine.TeleSalesResultados"
                  :header="`${
                    thisLine.TeleSalesResultados != undefined
                      ? thisLine.TeleSalesResultados.length
                      : 0
                  } replies`"
                >
                  <template #renderItem="{ item }">
                    <a-list-item>
                      <a-skeleton :loading="loading" active avatar>
                        <a-comment
                          :author="item.users.name + '' + item.users.lname"
                          :avatar="$baseUrl + 'storage/uploads/avatars/' + item.users.avatar"
                        >
                          <template #content>
                            <p v-if="item.tipo_venda">
                              Tipo de Venda :
                              <i>{{ item.tipo_venda }}</i>
                            </p>
                            <p v-if="item.oic">
                              OIC: <i>{{ item.oic }}</i>
                            </p>
                            <p v-if="item.oic_detalhe">
                              Oic detalhe :
                              <i>{{ item.oic_detalhe }}</i>
                            </p>
                            <p v-if="item.retencao_fonte">
                              Retenção na fonte:
                              <i>{{ item.retencao_fonte }}</i>
                            </p>
                            <p v-if="item.valor_proposto">
                              Valor proposto :
                              <i>{{ item.valor_proposto }}</i>
                            </p>
                            <p v-if="item.prestacao">
                              Prestacao:
                              <i>{{ item.prestacao }}</i>
                            </p>
                            <p v-if="item.prazo_vencimento">
                              Prazo vencimento : <i>{{ item.prazo_vencimento }}</i>
                            </p>
                            <p v-if="item.data_visita">
                              Data da visita :
                              <i>{{ item.data_visita }}</i>
                            </p>
                            <p v-if="item.estado_venda">
                              Estado venda :
                              <i>{{ item.estado_venda }}</i>
                            </p>
                            <p>
                              Comentário: <i>{{ item.comentario }}</i>
                            </p>
                          </template>
                          <template #datetime>
                            <a-tooltip :title="formatDate(item.created_at)">
                              <span>{{ dateFromNow(item.created_at) }}</span>
                            </a-tooltip>
                          </template>
                        </a-comment>
                      </a-skeleton>
                    </a-list-item>
                  </template>
                </a-list>
              </a-timeline-item>
              <a-timeline-item>
                <h5>Comentarios</h5>
                <a-list
                  class="comment-list"
                  item-layout="horizontal"
                  :data-source="thisLine.TeleSalesComents"
                  :header="`${
                    thisLine.TeleSalesComents != undefined ? thisLine.TeleSalesComents.length : 0
                  } replies`"
                >
                  <template #renderItem="{ item }">
                    <a-list-item>
                      <a-skeleton :loading="loading" active avatar>
                        <a-comment
                          :author="item.users.name + '' + item.users.lname"
                          :avatar="$baseUrl + 'storage/uploads/avatars/' + item.users.avatar"
                        >
                          <template #content>
                            <p>
                              Comment: <i>{{ item.comment }}</i>
                            </p>
                          </template>
                          <template #datetime>
                            <a-tooltip :title="formatDate(item.created_at)">
                              <span>{{ dateFromNow(item.created_at) }}</span>
                            </a-tooltip>
                          </template>
                        </a-comment>
                      </a-skeleton>
                    </a-list-item>
                  </template>
                </a-list>
              </a-timeline-item>
              <a-timeline-item></a-timeline-item>
            </a-timeline>
          </a-tab-pane>
          <a-tab-pane key="3" force-render>
            <template #tab>
              <span>
                <code-sandbox-outlined />
                Box
              </span>
            </template>
            <tabBox :tabBoxRef="detailsBox" />
          </a-tab-pane>
          <a-tab-pane v-if="this.dynamic_form_id" tab="Dynamic Form" key="4">
            <a
              v-if="this.dynamic_form_id"
              :href="
                $baseUrl +
                'dynamic-form/' +
                this.table +
                '/' +
                this.bulck +
                '/' +
                this.line_id +
                '/' +
                this.dynamic_form_id
              "
              target="_blank"
              block
              class="btn btn-primary"
              >Abrir Formulario</a
            >
          </a-tab-pane>
        </a-tabs>
      </a-drawer>
    </div>
  </div>
</template>


<script>
import tabBox from '../../Box/tabBox.vue'
import axios from 'axios'
import { message } from 'ant-design-vue'
import { copyText } from 'vue3-clipboard'
import moment from 'moment'

import { defineComponent, reactive, ref } from 'vue'
import {
  BellOutlined,
  PlusOutlined,
  CloudDownloadOutlined,
  ReloadOutlined,
  EyeOutlined,
  LinkOutlined,
  CopyOutlined,
  CodeSandboxOutlined,
  DownloadOutlined,
  ClockCircleOutlined,
  OrderedListOutlined
} from '@ant-design/icons-vue'

export default defineComponent({
  components: {
    BellOutlined,
    PlusOutlined,
    CloudDownloadOutlined,
    ReloadOutlined,
    EyeOutlined,
    LinkOutlined,
    CopyOutlined,
    CodeSandboxOutlined,
    tabBox,
    DownloadOutlined,
    ClockCircleOutlined,
    OrderedListOutlined
  },
  setup() {
    const formItemLayout = {
      labelCol: { span: 5 },
      wrapperCol: {
        span: 19,
        offset: 1
      }
    }
    const formTailLayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 8, offset: 2 }
    }
    const formPlusRef = ref({})
    const formPlus = reactive({
      table_name: '',
      cliente_name: '',
      cliente_nuit: '',
      cliente_cell: ''
    })

    const formAgenteRef = ref({})
    const formAgente = reactive({
      table_name: '',
      bulck: '',
      line_id: '',
      agente: '',
      agencia: '',
      district: '',
      province: ''
    })

    const formDonoRef = ref({})
    const formDono = reactive({
      table_name: '',
      bulck: '',
      line_id: '',
      users: ''
    })

    const formChamadasRef = ref({})
    const formChamadas = reactive({
      table_name: '',
      bulck: '',
      line_id: '',
      time: [],
      resultado: '',
      disponibilidade: '',
      comentario: ''
    })
    const formResultadoRef = ref({})
    const formResultado = reactive({
      table_name: '',
      bulck: '',
      line_id: '',
      estado_venda: '',
      tipo_venda: '',
      oic: '',
      oic_detalhe: '',
      retencao_fonte: '',
      valor_proposto: '',
      prestacao: '',
      prazo_vencimento: '',
      data_visita: '',
      comentario: ''
    })
    const formPlushandleValidate = async () => {
      try {
        const values = await formPlusRef.value.validateFields()
        //console.log('Success:', values);
        return { status: true, values: values }
      } catch (errorInfo) {
        //console.log('Failed:', errorInfo);
        return { status: false, values: [] }
      }
    }
    const formAgentehandleValidate = async () => {
      try {
        const values = await formAgenteRef.value.validateFields()
        //console.log('Success:', values);
        return { status: true, values: values }
      } catch (errorInfo) {
        //console.log('Failed:', errorInfo);
        return { status: false, values: [] }
      }
    }
    const formChamadashandleValidate = async () => {
      try {
        const values = await formChamadasRef.value.validateFields()
        //console.log('Success:', values);
        return { status: true, values: values }
      } catch (errorInfo) {
        //console.log('Failed:', errorInfo);
        return { status: false, values: [] }
      }
    }
    const formResultadohandleValidate = async () => {
      try {
        const values = await formResultadoRef.value.validateFields()
        //console.log('Success:', values);
        return { status: true, values: values }
      } catch (errorInfo) {
        //console.log('Failed:', errorInfo);
        return { status: false, values: [] }
      }
    }
    const formDonohandleValidate = async () => {
      try {
        const values = await formDonoRef.value.validateFields()
        //console.log('Success:', values);
        return { status: true, values: values }
      } catch (errorInfo) {
        //console.log('Failed:', errorInfo);
        return { status: false, values: [] }
      }
    }
    const formPlusReset = () => {
      formPlusRef.value.resetFields()
    }
    const formAgenteReset = () => {
      formAgenteRef.value.resetFields()
    }
    const formChamadasReset = () => {
      formChamadasRef.value.resetFields()
    }
    const formResultadoReset = () => {
      formResultadoRef.value.resetFields()
    }
    const formDonoReset = () => {
      formDonoRef.value.resetFields()
    }
    const toJson = (str) => {
      try {
        JSON.parse(str)
      } catch (error) {
        return false
      }
    }
    const doCopy = (fullUrl) => {
      copyText(fullUrl, undefined, (error) => {
        if (error) {
          alert('Can not copy')
          console.log(error)
        } else {
          message.success({
            content: () => 'Copied ' + fullUrl,
            class: 'custom-class',
            style: {
              marginTop: '10vh'
            },
            duration: 5
          })
        }
      })
    }

    return {
      formPlushandleValidate,
      formPlusRef,
      formPlus,
      formItemLayout,
      formTailLayout,
      formPlusReset,
      formAgente,
      formAgenteRef,
      formAgentehandleValidate,
      formAgenteReset,
      formChamadas,
      formChamadasRef,
      formChamadashandleValidate,
      formChamadasReset,
      formResultado,
      formResultadohandleValidate,
      formResultadoReset,
      formResultadoRef,
      formDonoRef,
      formDono,
      formDonohandleValidate,
      formDonoReset,
      doCopy,
      toJson
    }
  },

  data() {
    return {
      switchMeus: false,
      fetching: false,
      //data table
      url: '/v1/telesalesdata/',
      dataTable: '',
      options: {
        requestFunction(data) {
          return axios.get(this.url, {
            params: data
          })
        },
        responseAdapter(resp) {
          return {
            data: resp.data.data,
            count: resp.data.count
          }
        },
        texts: {
          loadingError: 'Oops! Something went wrong'
        },
        useDrawCounter: false,
        headings: {
          codigo: 'id'
        },
        filterByColumn: true,
        orderBy: { column: 'name', ascending: true },
        uniqueKey: 'id',
        perPage: 12,
        perPageValues: [12, 25, 50, 75, 100, 250, 500, 1000],
        pagination: {
          virtual: false
        }
      },

      //data table
      optionsCampains: [],
      dynamic_form_id: '',
      campanha: [],
      search: '',
      checkTipoVenda: false,
      checkOIC: false,
      checkOICDetalhes: false,
      checkValorProposto: false,
      checkPrazo: false,
      checkData: false,
      checkPrestacao: false,
      checkFonte: false,
      draw: false,
      columns: [],
      rows: [],
      keywords: null,
      loading: true,
      autoCompleteProgress: false,
      header: [],
      title: null,
      //formItemLayout,
      //formTailLayout,
      line_id: null,
      bulck: null,
      table: null,
      dataSource: [],
      agencias: [],
      agentes: [],
      thisLine: [],
      loadingLine: true,
      users: [],
      meus: true,
      visibleModal: false,
      confirmLoading: false,
      titleModal: 'Notificações',
      notificacoesModal: [],
      visibleModalPlus: false,
      chart_data: [],
      chart_config: {
        values: ['total'],
        date: {
          key: 'date',
          inputFormat: '%Y-%m-%d',
          outputFormat: '%Y-%m-%d'
        },
        points: false,
        axis: {
          yTicks: 3
        }
      },
      tempCabeca: [],
      detailsBox: []
    }
  },

  before(request) {
    // set previous request on Vue instance
    this.previousRequest = request
  },

  watch: {
    keywords() {
      this.formPlus.table_name = this.keywords
      this.fetch('/v1/getDataToTable', this.keywords)
    },

    search() {
      this.fetch('v1/getDataToTableSearch', this.keywords, this.search)
    }
  },

  directives: {},

  methods: {
    moment: moment,
    dateFromNow(date) {
      return moment(moment(new Date(date), 'DD-MM-YYYY HH:mm:ss')).fromNow()
    },

    dateformat(date) {
      return moment(new Date(date), 'DD-MM-YYYY')
    },
    formatDate(date) {
      return moment(date).format('DD-MM-YYYY HH:mm:ss')
    },
    exportTeleSales() {
      axios
        .get('/v1/get/exportTeleSales', { params: { keywords: this.keywords } })
        .then((response) => {
          this.openNotification('success', 'Export', response.data.success, 'bottomRight')
        })
    },
    exportTeleSalesSmple() {
      axios
        .get('/v1/get/exportTeleSales', { params: { keywords: this.keywords, type: 'simple' } })
        .then((response) => {
          this.openNotification('success', 'Export', response.data.success, 'bottomRight')
        })
    },
    showModal() {
      this.visibleModal = true
      this.handleNotificacao()
      this.perFormace()
    },
    plusClient() {
      this.visibleModalPlus = true
    },
    handleOk() {
      this.titleModal = 'The modal will be closed after two seconds'
      this.confirmLoading = true
      setTimeout(() => {
        this.visibleModal = false
        this.confirmLoading = false
        this.titleModal = 'Notificações'
      }, 2000)
    },
    handleCancel() {
      this.visibleModal = false
    },
    handleOkCM() {
      this.confirmLoading = true
      setTimeout(() => {
        this.visibleModalPlus = false
        this.confirmLoading = false
      }, 2000)
    },
    handleCancelCM() {
      this.visibleModalPlus = false
    },
    repleaseText(stringText) {
      return stringText.eplace('_', ' ')
    },
    onChangeMeus(checked) {
      if (checked == true) {
        // this.fetch("getDataToTableMeus",this.keywords) //deprecieted
        this.url = '/v1/telesalesdatameus/'
      } else {
        // this.fetch("getDataToTable",this.keywords); //deprecieted
        this.url = '/v1/telesalesdata/'
      }
    },
    handleSubmitAgente() {
      let _this = this
      this.formAgentehandleValidate().then(function (result) {
        switch (result.status) {
          case true:
            _this.sendData('telesalesSaveAgente', result.values)
            if (_this.sucess) {
              _this.formAgenteReset()
            }
            break
          default:
        }
      })
    },
    handleSubmitDono() {
      let _this = this
      this.formDonohandleValidate().then(function (result) {
        switch (result.status) {
          case true:
            _this.sendData('telesalesSaveDono', result.values)
            if (_this.sucess) {
              _this.formDonoReset()
            }
            break
          default:
        }
      })
    },

    handleSubmitChamadas() {
      let _this = this
      this.formChamadashandleValidate().then(function (result) {
        switch (result.status) {
          case true:
            _this.sendData('telesalesSaveChamadas', result.values)
            if (_this.sucess) {
              _this.formChamadasReset()
            }
            break
          default:
        }
      })
    },

    handleSubmitresultado() {
      let _this = this
      this.formResultadohandleValidate().then(function (result) {
        switch (result.status) {
          case true:
            _this.sendData('telesalesSaveResultados', result.values)
            if (_this.sucess) {
              _this.formResultadoReset()
            }
            break
          default:
        }
      })
    },
    handleSubmitPlus() {
      let _this = this
      this.formPlushandleValidate().then(function (result) {
        switch (result.status) {
          case true:
            _this.sendData('telesalesSavePlus', result.values, 'bottomRight')
            if (_this.sucess) {
              _this.formPlusReset()
              _this.fetch('/v1/getDataToTable', _this.keywords)
            }
            break
          default:
        }
      })
    },

    sendData(url, values, msg_p = 'bottomLeft') {
      axios
        .post('/v1/' + url, { values })
        .then((response) => {
          this.allerros = []
          this.sucess = true

          if (response.data.errors) {
            //console.log(response.data.errors);
            response.data.errors.forEach((error) => {
              this.openNotification('error', 'Error on Save', error, msg_p)
            })
          } else {
            this.openNotification('success', 'Save', response.data.success, msg_p)
            if (url == 'telesalesSaveResultados') {
              this.fetch('/v1/getDataToTable', this.keywords)
              this.onClose()
            }
          }
        })
        .catch((error) => {
          this.success = false
          //console.log(error.message);

          if (error.response) {
            if (error.response.data) {
              if (error.response.data.errors) {
                error.response.data.errors.forEach((error) => {
                  this.openNotification('error', 'Error on Save', error)
                })
              }

              if (error.response.data.error) {
                this.openNotification('error', 'Error on Save', error.response.data.error)
              }
            }
          } else {
            this.openNotification('error', 'Error on Save', error.message)
          }
        })
    },

    openNotification: function (type, m, d, p = 'bottomLeft') {
      this.$notification.config({
        placement: p,
        top: 60,
        duration: 5
      })
      this.$notification[type]({
        message: m,
        description: d
      })
    },

    handleChange(value) {
      //console.log(value);
      if (
        (value == 'Agente enviado para finalizar a venda') |
        (value == 'Agente enviado para esclarecimentos adicionais e finalizacao da venda')
      ) {
        this.checkTipoVenda = true
        this.checkValorProposto = true
        this.checkPrazo = true
        this.checkData = true
        this.checkOIC = true
        this.checkPrestacao = true
        this.checkFonte = true
      } else if ((value == 'Venda consumada') | (value == 'Desistencia')) {
        this.checkTipoVenda = true
        this.checkValorProposto = true
        this.checkPrazo = true
        this.checkData = false
        this.checkOIC = true
        this.checkPrestacao = true
        this.checkFonte = true
      } else if (
        (value == 'Pretende pensar') |
        (value == 'Vai reunir os documentos e dira algo') |
        (value == 'Ligar mais tarde')
      ) {
        this.checkData = true
      } else {
        this.checkTipoVenda = false
        this.checkValorProposto = false
        this.checkPrazo = false
        this.checkData = false
        this.checkOIC = false
        this.checkFonte = false
        this.checkPrestacao = false
      }
    },
    handleChangeOIC(value) {
      if (value == 'Sim') {
        this.checkOICDetalhes = true
      } else {
        this.checkOICDetalhes = false
      }
    },
    handleClick() {
      this.loading = !this.loading
    },
    onRowClick(params) {
      this.detailsBox = {
        NUIT: params.row.cliente_nuit,
        Date_Of_Birth: this.keywords
      }
      this.draw = true
      this.formAgente.line_id = this.line_id = params.row.id
      this.formAgente.bulck = this.bulck = params.row.bulk
      this.formAgente.table_name = this.table
      this.formChamadas.line_id = this.line_id = params.row.id
      this.formChamadas.bulck = this.bulck = params.row.bulk
      this.formChamadas.table_name = this.table
      this.formResultado.line_id = this.line_id = params.row.id
      this.formResultado.bulck = this.bulck = params.row.bulk
      this.formResultado.table_name = this.table
      this.formDono.line_id = this.line_id = params.row.id
      this.formDono.bulck = this.bulck = params.row.bulk
      this.formDono.table_name = this.table

      this.handleSearchLine(this.line_id, this.bulck, this.table)
      this.title =
        params.row.cliente_nuit + ' : ' + params.row.cliente_name + ' : ' + params.row.cliente_cell
    },
    onClose() {
      this.draw = false
    },

    handleSearchLine(line_id, bulck, table) {
      axios
        .get('/v1/tags/handleSearchLine', {
          params: { line_id: line_id, bulck: bulck, table: table }
        })
        .then((response) => {
          ;(this.thisLine = response.data), (this.loadingLine = false)
        })
    },

    handleSearch(value) {
      var len = value.length
      if (len >= 3) {
        axios.get('/v1/tags/agentes', { params: { keywords: value } }).then((response) => {
          response.data.forEach((r) => {
            this.agentes = []
            this.agentes.push({
              value: r.ConsultantID,
              label:
                '(' + r.ConsultantCode + ') ' + r.ConsultantFirstNames + ' ' + r.ConsultantSurname
            })
          })
        })
      } else {
        this.agentes = []
      }
    },

    handleUsers(value) {
      var len = value.length
      if (len >= 3) {
        axios.get('/v1/tags/users', { params: { keywords: value } }).then((response) => {
          this.users = []
          response.data.forEach((r) => {
            this.users.push({
              value: r.id,
              label: r.name + ' ' + r.lname
            })
          })
        })
      }
    },

    handleNotificacao() {
      axios
        .get('/v1/get/notifications', { params: { keywords: this.keywords } })
        .then((response) => {
          this.notificacoesModal = response.data
        })
    },

    perFormace() {
      axios.get('/v1/get/performace', { params: { keywords: this.keywords } }).then((response) => {
        this.chart_data = response.data.data
      })
    },

    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
      )
    },

    fetch(url, keywords, search) {
      this.autoCompleteProgress = true
      this.loading = true
      this.meus = true
      axios
        .get(url, { params: { keywords: keywords, search: search } })
        .then((response) => {
          // localStorage.setItem('step1', JSON.stringify(response.data));
          //    console.log('Sucess');
          //   var tableData = JSON.parse(localStorage.getItem('step1'));

          //console.log(this.rows)
          this.autoCompleteProgress = false
          this.loading = false
          this.meus = false
          var arrHeader = response.data.header
          this.options.headings = this.head(arrHeader)
          this.columns = this.headColumns(arrHeader)
          this.rows = response.data.data
          this.campanha = response.data.campanha
          this.dynamic_form_id = this.campanha.dynamic_form_id
          this.table = this.campanha.table_name
        })

        .catch({})
    },
    head(columns) {
      var newColumns = []
      var lines = Object.values(columns)
      lines.forEach(function (el) {
        newColumns[el.field] = el.label
      })

      return newColumns
    },
    headColumns(columns) {
      var newColumns = []
      var lines = Object.values(columns)
      lines.forEach(function (el) {
        newColumns.push(el.field)
      })

      return newColumns
    }
  },

  mounted() {
    axios.get('/v1/mycampanha').then((response) => {
      this.optionsCampains = response.data
      /*$.each(response.data, function ( value) {
                        $("#campanhas").append('<option value="'+value.table_name+'">'+value.aliase+'</option>');
                    })*/
    })

    axios.get('/v1/tags/agencias').then((response) => {
      response.data.forEach((r) => {
        this.agencias.push({
          value: r.id_agencia,
          label: r.outletSyncNameCorrected
        })
      })
    })
  }
})
</script>
<style>
@import 'https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.5.2/css/bootstrap.css';
svg {
  margin-bottom: 4px;
}
</style>

<style>
.ant-btn-lg {
  height: 30px;
}
.VueTables__error {
  color: red;
}

.VueTables__wrapper {
  max-height: 1000px;
  overflow-y: scroll;
}
</style>
