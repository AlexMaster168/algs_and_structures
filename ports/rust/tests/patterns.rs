use algorithm_collection::patterns::{
    architectural as a, behavioral as b, creational as c, structural as s,
};
use std::{
    cell::{Cell, RefCell},
    future::{ready, Future},
    rc::Rc,
    sync::Arc,
    task::{Context, Poll, Wake, Waker},
};
fn block_on<T>(future: impl Future<Output = T>) -> T {
    struct ThreadWake(std::thread::Thread);
    impl Wake for ThreadWake {
        fn wake(self: Arc<Self>) {
            self.0.unpark();
        }
        fn wake_by_ref(self: &Arc<Self>) {
            self.0.unpark();
        }
    }
    let waker = Waker::from(Arc::new(ThreadWake(std::thread::current())));
    let mut context = Context::from_waker(&waker);
    let mut future = Box::pin(future);
    loop {
        match future.as_mut().poll(&mut context) {
            Poll::Ready(value) => return value,
            Poll::Pending => std::thread::park(),
        }
    }
}
#[test]
fn creational() {
    use c::{factory_method::Logistics, prototype::Shape};
    assert!(std::ptr::eq(
        c::singleton::AppConfig::get_instance(),
        c::singleton::AppConfig::get_instance()
    ));
    let count = Rc::new(Cell::new(0));
    let observed = count.clone();
    let mut singleton = c::singleton::lazy_singleton(move || {
        observed.set(observed.get() + 1);
        Rc::new(3)
    });
    assert!(Rc::ptr_eq(&singleton(), &singleton()));
    assert_eq!(count.get(), 1);
    assert_eq!(
        c::factory_method::RoadLogistics.plan_delivery("box"),
        "Truck delivers box by road"
    );
    assert_eq!(
        c::abstract_factory::render_settings_form(&c::abstract_factory::DarkThemeFactory),
        vec!["[dark x]", "[dark button: Save]"]
    );
    let mut builder = c::builder::HttpRequestBuilder::post("https://example.test");
    builder
        .param("q", "a b")
        .json(&serde_json::json!({"ok":true}));
    let request = builder.build().unwrap();
    assert_eq!(request.url, "https://example.test?q=a+b");
    assert_eq!(request.body.unwrap(), "{\"ok\":true}");
    assert!(c::builder::HttpRequestBuilder::get("x")
        .json(&serde_json::json!(3))
        .build()
        .is_err());
    let circle = c::prototype::Circle {
        x: 0.0,
        y: 0.0,
        color: "red".into(),
        radius: 2.0,
        tags: vec!["old".into()],
    };
    let mut registry = c::prototype::PrototypeRegistry::new();
    registry.register("circle".into(), circle);
    let mut cloned = registry.create("circle").unwrap();
    cloned.tags.push("new".into());
    assert_eq!(registry.create("circle").unwrap().tags.len(), 1);
    assert!((cloned.area() - 4.0 * std::f64::consts::PI).abs() < 1e-9);
    let mut pool = c::object_pool::ObjectPool::new(|| 0, |value| *value = 0, 1);
    assert_eq!(
        pool.use_item(|value| {
            *value = 3;
            *value
        })
        .unwrap(),
        3
    );
    let item = pool.acquire().unwrap();
    assert_eq!(*item.borrow(), 0);
    assert!(pool.acquire().is_err());
    pool.release(item).unwrap();
    assert_eq!(pool.available_count(), 1);
}
#[test]
fn structural() {
    use s::{
        adapter::TemperatureSensor, bridge::Device, composite::FileSystemNode, decorator::Notifier,
        proxy::WeatherService,
    };
    assert_eq!(
        s::adapter::FahrenheitSensorAdapter::new(s::adapter::LegacyFahrenheitSensor::new(212.0))
            .celsius(),
        100.0
    );
    let adapted = s::adapter::promisify(
        |value: i32, callback: Box<dyn FnOnce(Result<i32, String>) + Send>| callback(Ok(value * 2)),
    );
    assert_eq!(adapted(4).recv().unwrap(), Ok(8));
    let tv = Rc::new(RefCell::new(s::bridge::Tv::default()));
    let remote = s::bridge::AdvancedRemoteControl::new(tv.clone());
    remote.toggle_power();
    remote.volume_up(100.0);
    assert_eq!(tv.borrow().get_volume(), 100.0);
    remote.mute();
    assert_eq!(tv.borrow().get_volume(), 0.0);
    assert!(tv.borrow().is_enabled());
    let mut directory = s::composite::Directory::new("root".into());
    directory.add(vec![
        Box::new(s::composite::FileEntry::new("a".into(), 3.0)) as Box<dyn FileSystemNode>,
        Box::new(s::composite::FileEntry::new("b".into(), 4.0)),
    ]);
    assert_eq!(directory.size(), 7.0);
    assert!(directory.remove("a"));
    assert_eq!(directory.size(), 4.0);
    let notifier = s::decorator::SmsNotifier::new(
        Box::new(s::decorator::EmailNotifier::new("test@example.test".into())),
        "123".into(),
    );
    assert_eq!(notifier.send("hello").len(), 2);
    let logs = Rc::new(RefCell::new(Vec::new()));
    let collected = logs.clone();
    let mut logged = s::decorator::with_logging(
        |args| serde_json::json!(args[0].as_i64().unwrap() * 2),
        move |line| collected.borrow_mut().push(line),
        "double".into(),
    );
    assert_eq!(logged(vec![serde_json::json!(3)]), serde_json::json!(6));
    assert_eq!(*logs.borrow(), vec!["double(3)", "double -> 6"]);
    assert_eq!(
        s::facade::VideoConverter.convert("x.mp4", "ogg"),
        "buffer(x.mp4, mp4-codec) -> ogg + normalized audio"
    );
    let mut forest = s::flyweight::Forest::default();
    forest
        .plant(1.0, 2.0, "oak".into(), "green".into(), "rough".into())
        .plant(3.0, 4.0, "oak".into(), "green".into(), "rough".into());
    assert_eq!(forest.type_count(), 1);
    assert_eq!(forest.tree_count(), 2);
    struct Weather(Rc<Cell<usize>>);
    impl WeatherService for Weather {
        fn temperature<'a>(&'a mut self, _: &'a str) -> s::proxy::WeatherFuture<'a> {
            self.0.set(self.0.get() + 1);
            Box::pin(async { Ok(12.0) })
        }
    }
    let calls = Rc::new(Cell::new(0));
    let clock = Rc::new(Cell::new(0));
    let observed = clock.clone();
    let mut proxy =
        s::proxy::CachingWeatherProxy::new(Weather(calls.clone()), 10, move || observed.get());
    assert_eq!(block_on(proxy.temperature("x")), Ok(12.0));
    block_on(proxy.temperature("x")).unwrap();
    assert_eq!(calls.get(), 1);
    clock.set(11);
    block_on(proxy.temperature("x")).unwrap();
    assert_eq!(calls.get(), 2);
    let mut denied = s::proxy::AccessControlProxy::new(Weather(calls), || false);
    assert!(block_on(denied.temperature("x")).is_err());
    let mut object = serde_json::Map::new();
    let mut validated = s::proxy::create_validated_object(&mut object, |_, value| {
        value.as_i64().is_some_and(|n| n > 0)
    });
    validated.set("n".into(), serde_json::json!(2)).unwrap();
    assert!(validated.set("n".into(), serde_json::json!(-1)).is_err());
    assert_eq!(validated.get("n"), Some(&serde_json::json!(2)));
}
#[test]
fn behavioral() {
    use b::{template_method::SalesDataMiner, visitor::VisitableShape};
    let chain = b::chain_of_responsibility::create_support_chain();
    assert_eq!(
        chain.handle(&b::chain_of_responsibility::Ticket {
            topic: "password".into(),
            severity: 1
        }),
        "Bot: Use the \"Forgot password\" link"
    );
    assert_eq!(
        chain.handle(&b::chain_of_responsibility::Ticket {
            topic: "bug".into(),
            severity: 3
        }),
        "Engineer fixed bug"
    );
    let document = Rc::new(RefCell::new(b::command::TextDocument::default()));
    let mut history = b::command::CommandHistory::new();
    history.run(Box::new(b::command::InsertCommand::new(
        document.clone(),
        0,
        "hello".into(),
    )));
    history.run(Box::new(b::command::DeleteCommand::new(
        document.clone(),
        1,
        2,
    )));
    assert_eq!(document.borrow().content, "hlo");
    assert!(history.undo());
    assert_eq!(document.borrow().content, "hello");
    assert!(history.redo());
    assert_eq!(document.borrow().content, "hlo");
    assert_eq!(
        b::interpreter::parse_expression("2 + x * (3 + 1)")
            .unwrap()
            .interpret(&std::collections::HashMap::from([("x".into(), 5.0)]))
            .unwrap(),
        22.0
    );
    assert!(b::interpreter::parse_expression("2 +").is_err());
    assert_eq!(
        b::interpreter::parse_expression("2.5 + 0.5")
            .unwrap()
            .interpret(&Default::default())
            .unwrap(),
        3.0
    );
    assert_eq!(
        b::iterator::take(b::iterator::NumberRange::new(0.0, 10.0, 1.0).iter(), 3)
            .collect::<Vec<_>>(),
        vec![0.0, 1.0, 2.0]
    );
    let roots = vec![b::iterator::TreeItem {
        value: 1,
        children: vec![
            b::iterator::TreeItem {
                value: 2,
                children: vec![b::iterator::TreeItem {
                    value: 4,
                    children: Vec::new(),
                }],
            },
            b::iterator::TreeItem {
                value: 3,
                children: Vec::new(),
            },
        ],
    }];
    assert_eq!(
        b::iterator::depth_first(&roots)
            .copied()
            .collect::<Vec<_>>(),
        vec![1, 2, 4, 3]
    );
    assert_eq!(
        b::iterator::breadth_first(&roots)
            .copied()
            .collect::<Vec<_>>(),
        vec![1, 2, 3, 4]
    );
    use b::mediator::ChatMediator;
    let room = b::mediator::ChatRoom::new();
    let first = Rc::new(b::mediator::ChatUser::new("a".into()));
    let second = Rc::new(b::mediator::ChatUser::new("b".into()));
    room.join(first.clone());
    room.join(second.clone());
    first.say("hello", None).unwrap();
    assert_eq!(*second.inbox.borrow(), vec!["a: hello"]);
    let editor = Rc::new(RefCell::new(b::memento::Editor::new()));
    let mut snapshots = b::memento::EditorHistory::new(editor.clone());
    editor.borrow_mut().type_text("abc");
    snapshots.backup();
    editor.borrow_mut().type_text("d");
    assert!(snapshots.undo());
    assert_eq!(editor.borrow().text(), "abc");
    let subject = b::observer::Subject::new();
    let total = Rc::new(Cell::new(0));
    let collected = total.clone();
    let observer: b::observer::Observer<i32> =
        Rc::new(move |value| collected.set(collected.get() + value));
    let unsubscribe = subject.subscribe(observer.clone());
    let _other = subject.subscribe(observer);
    subject.notify(&2);
    unsubscribe();
    subject.notify(&5);
    assert_eq!(total.get(), 2);
    let mut order = b::state::Order::new();
    assert!(order.ship().is_err());
    order.pay().unwrap();
    order.ship().unwrap();
    order.deliver().unwrap();
    assert_eq!(order.history, vec!["new", "paid", "shipped", "delivered"]);
    let shipping =
        b::strategy::ShippingCalculator::new(Rc::new(b::strategy::WeightBasedShipping::new(3.0)));
    assert_eq!(
        shipping.calculate(&b::strategy::Parcel {
            weight_kg: 2.5,
            order_total: 100.0
        }),
        9.0
    );
    let report = b::template_method::JsonSalesMiner
        .mine("[{\"product\":\"a\",\"amount\":3},{\"product\":\"b\",\"amount\":4}]")
        .unwrap();
    assert_eq!(report.total, 7.0);
    assert_eq!(report.top_product.as_deref(), Some("b"));
    assert_eq!(
        b::visitor::RectangleShape {
            width: 3.0,
            height: 4.0
        }
        .accept(&b::visitor::AreaVisitor),
        12.0
    );
    assert_eq!(
        b::visitor::TriangleShape {
            a: 3.0,
            b: 4.0,
            c: 5.0
        }
        .accept(&b::visitor::PerimeterVisitor),
        12.0
    );
}
#[test]
fn architectural() {
    use a::{repository::Repository, specification::Specification};
    let container = a::dependency_injection::Container::new();
    let service = a::dependency_injection::token::<Rc<i32>>("service".into());
    container.register(&service, |_| Ok(Rc::new(4)), true);
    assert!(Rc::ptr_eq(
        &container.resolve(&service).unwrap(),
        &container.resolve(&service).unwrap()
    ));
    let cyclic = a::dependency_injection::token::<i32>("cycle".into());
    let target = cyclic.clone();
    container.register(&cyclic, move |container| container.resolve(&target), true);
    assert!(container.resolve(&cyclic).unwrap_err().contains("Circular"));
    assert!(container.resolve(&cyclic).unwrap_err().contains("Circular"));
    let emitter = a::event_emitter::TypedEventEmitter::new();
    let total = Rc::new(Cell::new(0));
    let collected = total.clone();
    let observer: b::observer::Observer<i32> =
        Rc::new(move |value| collected.set(collected.get() + value));
    let _off = emitter.once("x".into(), observer);
    assert_eq!(emitter.emit("x", &3), 0);
    assert_eq!(emitter.emit("x", &3), 0);
    assert_eq!(total.get(), 3);
    let mut pipeline = a::middleware::Pipeline::new();
    pipeline
        .use_middleware(Rc::new(|context: Rc<RefCell<Vec<i32>>>, next| {
            Box::pin(async move {
                context.borrow_mut().push(1);
                next().await?;
                context.borrow_mut().push(4);
                Ok(())
            })
        }))
        .use_middleware(Rc::new(|context, next| {
            Box::pin(async move {
                context.borrow_mut().push(2);
                next().await?;
                context.borrow_mut().push(3);
                Ok(())
            })
        }));
    let context = Rc::new(RefCell::new(Vec::new()));
    block_on(pipeline.run(context.clone())).unwrap();
    assert_eq!(*context.borrow(), vec![1, 2, 3, 4]);
    let mut bad = a::middleware::Pipeline::<()>::new();
    bad.use_middleware(Rc::new(|_, next| {
        Box::pin(async move {
            next().await?;
            next().await
        })
    }));
    assert!(block_on(bad.run(Rc::new(RefCell::new(()))))
        .unwrap_err()
        .contains("multiple"));
    let memory = Rc::new(a::null_object::MemoryLogger::default());
    let payment = a::null_object::PaymentService::new(memory.clone());
    assert!(payment.charge(3.0));
    assert!(!payment.charge(-1.0));
    assert_eq!(memory.lines.borrow().len(), 2);
    #[derive(Clone)]
    struct Entity {
        id: String,
        values: Vec<i32>,
    }
    impl a::repository::Entity for Entity {
        fn id(&self) -> &str {
            &self.id
        }
    }
    let mut repository = a::repository::InMemoryRepository::default();
    block_on(repository.save(Entity {
        id: "a".into(),
        values: vec![1],
    }));
    let mut entity = block_on(repository.find_by_id("a")).unwrap();
    entity.values.push(2);
    assert_eq!(
        block_on(repository.find_by_id("a")).unwrap().values,
        vec![1]
    );
    assert!(block_on(repository.delete("a")));
    let positive = a::specification::spec(|value: &i32| *value > 0);
    assert!(!positive.and(positive.not()).is_satisfied_by(&2));
    let store = a::store::create_store(a::store::counter_reducer, 0.0);
    store.dispatch(a::store::CounterAction::Add(5.0));
    assert_eq!(store.get_state(), 5.0);
    let attempts = Cell::new(0);
    let result = block_on(a::circuit_breaker::retry(
        || {
            attempts.set(attempts.get() + 1);
            ready(if attempts.get() < 3 {
                Err("again")
            } else {
                Ok(7)
            })
        },
        a::circuit_breaker::RetryOptions::default(),
    ));
    assert_eq!(result, Ok(7));
    assert_eq!(attempts.get(), 3);
    let clock = Rc::new(Cell::new(0));
    let observed = clock.clone();
    let fail = Rc::new(Cell::new(true));
    let failing = fail.clone();
    let mut breaker = a::circuit_breaker::CircuitBreaker::new(
        move |value: i32| {
            ready(if failing.get() {
                Err("offline")
            } else {
                Ok(value)
            })
        },
        a::circuit_breaker::CircuitBreakerOptions {
            failure_threshold: 1,
            reset_timeout_ms: 10,
            now: Box::new(move || observed.get()),
        },
    );
    assert!(block_on(breaker.call(1)).is_err());
    assert_eq!(breaker.state(), "open");
    clock.set(11);
    assert_eq!(breaker.state(), "half-open");
    fail.set(false);
    assert_eq!(block_on(breaker.call(2)).unwrap(), 2);
    assert_eq!(breaker.state(), "closed");
}
