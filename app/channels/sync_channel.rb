class SyncChannel < ApplicationCable::Channel
  @offset = Time.current.beginning_of_day.to_f

  def subscribed
    # cue for everyone
    stream_from "cues"

    # for time_sync with each device
    stream_from "time_sync:#{user_params}"
    if admin_check
      # for admin
      stream_from "devices"
    end

    @offset = Time.current.beginning_of_day.to_f
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
    # sleep 0.5 + 0.001 *  rand(100)
    time = Time.current
    logger.info Time.current.beginning_of_day
    initial_time = (time.to_f - @offset).to_s.match(/.*\./).to_s + time.nsec.to_s
    logger.info "current_time = #{initial_time}"
    response = data
    response[:t2] = initial_time.to_f * 1000.0
    response[:action] = "time_sync"

    ActionCable.server.broadcast "time_sync:#{user_params}", response
    logger.info time.to_f - Time.current.to_f # auditionで5台同時に録音した時に、平均2~3msec、最大8msecの遅延
  end

  def send_audio_node_json(data)
    if admin_check
      ActionCable.server.broadcast "cues", action: "audio_nodes", json: data["json"], start_time: data["start_time"]
    end
  end

  def send_audio_params(data)
    if admin_check
      ActionCable.server.broadcast "cues", action: "audio_params", text: data["text"]
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
