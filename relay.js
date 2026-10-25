// Thin wrapper around MQTT.js (same broker as the e-Souvenir unveil).
(function () {
  const C = window.QUIZ;
  const T = s => C.topic + '/' + s;

  function connect(opts) {
    const cid = (opts.prefix || 'c') + '-' + Math.random().toString(36).slice(2, 10);
    const o = { clientId: cid, clean: true, keepalive: 15, reconnectPeriod: 1000, connectTimeout: 8000 };
    if (opts.will) {
      o.will = { topic: T(opts.will.topic), payload: JSON.stringify(opts.will.payload), qos: 1, retain: true };
    }
    const client = mqtt.connect(C.broker, o);
    const status = s => opts.onStatus && opts.onStatus(s);
    const subs = typeof opts.subscribe === 'function' ? opts.subscribe(cid) : (opts.subscribe || []);

    client.on('connect', () => {
      status('online');
      client.subscribe(subs.map(T), { qos: 0 });
      opts.onConnect && opts.onConnect();
    });
    client.on('reconnect', () => status('reconnecting'));
    client.on('offline', () => status('offline'));
    client.on('close', () => status('offline'));
    client.on('error', e => console.warn('MQTT', e && e.message));
    client.on('message', (topic, buf) => {
      let m;
      try { m = JSON.parse(buf.toString()); } catch (e) { return; }
      opts.onMessage && opts.onMessage(topic.slice(C.topic.length + 1), m);
    });

    const send = (topic, obj, retain) => {
      if (!client.connected) return false;
      client.publish(T(topic), JSON.stringify(obj), { qos: retain ? 1 : 0, retain: !!retain });
      return true;
    };
    return { client, cid, send };
  }

  window.Relay = { connect, T };
})();
