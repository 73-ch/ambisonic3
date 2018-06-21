class SyncChannel < ApplicationCable::Channel
  def subscribed
    stream_from "sync"
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
  end

  def say_hello(rcv)
    logger.info "received!!"
    logger.info rcv["content"]
    ActionCable.server.broadcast "sync", message: "hello!!"
  end
end
