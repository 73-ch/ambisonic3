class SyncChannel < ApplicationCable::Channel
  def subscribed
    # cue for everyone
    stream_from "cues"
    if admin_check
      # for admin
      stream_from "devices"
    else
      # for time_sync with each device
      stream_from "time_sync:#{user_params}"
    end
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
  end

  def say_hello(rcv)
    logger.info rcv["content"]
    ActionCable.server.broadcast "cues", message: "Listen cues"
    ActionCable.server.broadcast "time_sync:#{user_params}", message: "Listen time_sync:#{user_params}"
    ActionCable.server.broadcast "devices", message: "Listen devices"
  end

  def sync_time(data)
    time = Time.current
    initial_time = (time.to_f).to_s.match(/.*\./).to_s + time.nsec.to_s
    logger.info "current_time = #{initial_time}"

    ActionCable.server.broadcast "time_sync:#{data["user_params"]}", message: "time_sync", time: initial_time
   end

  def send_audio_node_json(data)
    if admin_check
      ActionCable.server.broadcast "cues", message: "audio_nodes", json: data["json"]
    end
  end

  def get_user_params(data)
    logger.info "______________"
    if admin_check
      ActionCable.server.broadcast "devices", message: "user_params", user_params: user_params
    else
      ActionCable.server.broadcast "time_sync:#{user_params}", message: "user_params", user_params: user_params
    end
  end


  private
  def admin_check
    user_params == "admin"
  end
end
