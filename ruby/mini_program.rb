module MiniProgram

  def get_mp_access_token
    query = {
      appid: '你的小程序app id',
      secret: '你的小程序app secret',

      grant_type: 'client_credential', # 固定参数
    }
    req = RestClient.get("https://api.weixin.qq.com/cgi-bin/token?" + query.to_query)
    JSON.parse(req)
  end

  def send_mp_template_message
    access_token = get_mp_access_token["access_token"]
    data = {
      touser: "目标用户的open id",
      template_id: "模板消息id", # 从小程序管理后台复制
      page: "/pages/profile/profile?refer=pay_template_massage",
      form_id: "支付的prepay_id",
      data: {
        keyword1: {
          value: "年度订阅",
          color: '#333'
        },
        keyword2: {
          value: "999",
          color: '#333'
        },
        keyword3: {
          value: "2018-01-01",
          color: '#333'
        },
        keyword4: {
          value: "ZZXXYYVV",
          color: '#333'
        },
      }
    }
    RestClient::Request.new(
      method: 'post',
      url: "https://api.weixin.qq.com/cgi-bin/message/wxopen/template/send?access_token=#{access_token}",
      payload: data.to_json,
      :verify_ssl => false
    ).execute
  end

  # 获取小程序码
  def get_mp_code_image
    access_token = get_mp_access_token["access_token"]
    data = {
      path: "/pages/home/home"
    }
    rsp = RestClient.post("https://api.weixin.qq.com/wxa/getwxacode?access_token=#{access_token}",
      data.to_json)
    File.open("#{Rails.root}/public/images/mp_code.png", 'wb') { |x| x.puts rsp.body }
  end

end
