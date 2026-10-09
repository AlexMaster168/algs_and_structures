#include "../algorithms/backtracking/n-queens.hpp"
#include "../algorithms/backtracking/permutations.hpp"
#include "../algorithms/backtracking/sudoku.hpp"
#include "../algorithms/backtracking/word-search.hpp"
#include "../algorithms/bit-manipulation/bits.hpp"
#include "../algorithms/dynamic-programming/coin-change.hpp"
#include "../algorithms/dynamic-programming/edit-distance.hpp"
#include "../algorithms/dynamic-programming/fibonacci.hpp"
#include "../algorithms/dynamic-programming/grid-paths.hpp"
#include "../algorithms/dynamic-programming/knapsack.hpp"
#include "../algorithms/dynamic-programming/longest-common-subsequence.hpp"
#include "../algorithms/dynamic-programming/longest-increasing-subsequence.hpp"
#include "../algorithms/dynamic-programming/matrix-chain.hpp"
#include "../algorithms/dynamic-programming/max-subarray.hpp"
#include "../algorithms/dynamic-programming/memoize.hpp"
#include "../algorithms/dynamic-programming/rod-cutting.hpp"
#include "../algorithms/dynamic-programming/subset-sum.hpp"
#include "../algorithms/dynamic-programming/word-break.hpp"
#include "../algorithms/geometry/geometry.hpp"
#include "../algorithms/graphs/a-star.hpp"
#include "../algorithms/graphs/bellman-ford.hpp"
#include "../algorithms/graphs/bfs.hpp"
#include "../algorithms/graphs/bipartite.hpp"
#include "../algorithms/graphs/bridges-and-articulation-points.hpp"
#include "../algorithms/graphs/connected-components.hpp"
#include "../algorithms/graphs/cycle-detection.hpp"
#include "../algorithms/graphs/dfs.hpp"
#include "../algorithms/graphs/dijkstra.hpp"
#include "../algorithms/graphs/eulerian-path.hpp"
#include "../algorithms/graphs/flood-fill.hpp"
#include "../algorithms/graphs/floyd-warshall.hpp"
#include "../algorithms/graphs/max-flow.hpp"
#include "../algorithms/graphs/minimum-spanning-tree.hpp"
#include "../algorithms/graphs/strongly-connected-components.hpp"
#include "../algorithms/graphs/topological-sort.hpp"
#include "../algorithms/graphs/types.hpp"
#include "../algorithms/greedy/activity-selection.hpp"
#include "../algorithms/greedy/fractional-knapsack.hpp"
#include "../algorithms/greedy/huffman.hpp"
#include "../algorithms/greedy/jump-game.hpp"
#include "../algorithms/math/combinatorics.hpp"
#include "../algorithms/math/gcd.hpp"
#include "../algorithms/math/matrix.hpp"
#include "../algorithms/math/number-conversion.hpp"
#include "../algorithms/math/power.hpp"
#include "../algorithms/math/primes.hpp"
#include "../algorithms/randomized/shuffle.hpp"
#include "../algorithms/searching/binary-search.hpp"
#include "../algorithms/searching/exponential-search.hpp"
#include "../algorithms/searching/interpolation-search.hpp"
#include "../algorithms/searching/jump-search.hpp"
#include "../algorithms/searching/linear-search.hpp"
#include "../algorithms/searching/quick-select.hpp"
#include "../algorithms/searching/ternary-search.hpp"
#include "../algorithms/sorting/bubble-sort.hpp"
#include "../algorithms/sorting/bucket-sort.hpp"
#include "../algorithms/sorting/cocktail-shaker-sort.hpp"
#include "../algorithms/sorting/counting-sort.hpp"
#include "../algorithms/sorting/heap-sort.hpp"
#include "../algorithms/sorting/index.hpp"
#include "../algorithms/sorting/insertion-sort.hpp"
#include "../algorithms/sorting/merge-sort.hpp"
#include "../algorithms/sorting/quick-sort.hpp"
#include "../algorithms/sorting/radix-sort.hpp"
#include "../algorithms/sorting/selection-sort.hpp"
#include "../algorithms/sorting/shell-sort.hpp"
#include "../algorithms/sorting/tim-sort.hpp"
#include "../algorithms/strings/aho-corasick.hpp"
#include "../algorithms/strings/boyer-moore-horspool.hpp"
#include "../algorithms/strings/kmp.hpp"
#include "../algorithms/strings/manacher.hpp"
#include "../algorithms/strings/rabin-karp.hpp"
#include "../algorithms/strings/string-utils.hpp"
#include "../algorithms/strings/suffix-array.hpp"
#include "../algorithms/strings/z-function.hpp"
#include "../algorithms/techniques/prefix-sums.hpp"
#include "../algorithms/techniques/sliding-window.hpp"
#include "../algorithms/techniques/two-pointers.hpp"
#include "../algorithms/trees/binary-tree.hpp"
#include "../algorithms/trees/lowest-common-ancestor.hpp"
#include "../algorithms/trees/tree-diameter.hpp"
#include "../data-structures/graphs/disjoint-set.hpp"
#include "../data-structures/graphs/graph.hpp"
#include "../data-structures/hashing/bloom-filter.hpp"
#include "../data-structures/hashing/hash-table.hpp"
#include "../data-structures/hashing/hash.hpp"
#include "../data-structures/hashing/lru-cache.hpp"
#include "../data-structures/hashing/open-addressing-hash-map.hpp"
#include "../data-structures/heaps/binary-heap.hpp"
#include "../data-structures/heaps/priority-queue.hpp"
#include "../data-structures/linear/circular-buffer.hpp"
#include "../data-structures/linear/deque.hpp"
#include "../data-structures/linear/doubly-linked-list.hpp"
#include "../data-structures/linear/linked-list.hpp"
#include "../data-structures/linear/queue.hpp"
#include "../data-structures/linear/skip-list.hpp"
#include "../data-structures/linear/stack.hpp"
#include "../data-structures/range-queries/fenwick-tree.hpp"
#include "../data-structures/range-queries/lazy-segment-tree.hpp"
#include "../data-structures/range-queries/segment-tree.hpp"
#include "../data-structures/range-queries/sparse-table.hpp"
#include "../data-structures/range-queries/sqrt-decomposition.hpp"
#include "../data-structures/trees/avl-tree.hpp"
#include "../data-structures/trees/b-tree.hpp"
#include "../data-structures/trees/binary-search-tree.hpp"
#include "../data-structures/trees/red-black-tree.hpp"
#include "../data-structures/trees/tree-iterator.hpp"
#include "../data-structures/trees/trie.hpp"
#include "../patterns/architectural/circuit-breaker.hpp"
#include "../patterns/architectural/dependency-injection.hpp"
#include "../patterns/architectural/event-emitter.hpp"
#include "../patterns/architectural/middleware.hpp"
#include "../patterns/architectural/null-object.hpp"
#include "../patterns/architectural/repository.hpp"
#include "../patterns/architectural/specification.hpp"
#include "../patterns/architectural/store.hpp"
#include "../patterns/behavioral/chain-of-responsibility.hpp"
#include "../patterns/behavioral/command.hpp"
#include "../patterns/behavioral/interpreter.hpp"
#include "../patterns/behavioral/iterator.hpp"
#include "../patterns/behavioral/mediator.hpp"
#include "../patterns/behavioral/memento.hpp"
#include "../patterns/behavioral/observer.hpp"
#include "../patterns/behavioral/state.hpp"
#include "../patterns/behavioral/strategy.hpp"
#include "../patterns/behavioral/template-method.hpp"
#include "../patterns/behavioral/visitor.hpp"
#include "../patterns/creational/abstract-factory.hpp"
#include "../patterns/creational/builder.hpp"
#include "../patterns/creational/factory-method.hpp"
#include "../patterns/creational/object-pool.hpp"
#include "../patterns/creational/prototype.hpp"
#include "../patterns/creational/singleton.hpp"
#include "../patterns/structural/adapter.hpp"
#include "../patterns/structural/bridge.hpp"
#include "../patterns/structural/composite.hpp"
#include "../patterns/structural/decorator.hpp"
#include "../patterns/structural/facade.hpp"
#include "../patterns/structural/flyweight.hpp"
#include "../patterns/structural/proxy.hpp"
#include "../shared/compare.hpp"
#include "../shared/json.hpp"
#include <cassert>
#include <iostream>
using namespace algs;
int main() {
    assert(&AppConfig::getInstance() == &AppConfig::getInstance());
    int created = 0; auto singleton = lazySingleton<std::shared_ptr<int>>([&] { ++created; return std::make_shared<int>(7); }); assert(singleton() == singleton() && created == 1);
    assert(RoadLogistics().planDelivery("box") == "Truck delivers box by road");
    assert(renderSettingsForm(DarkThemeFactory())[0] == "[dark x]");
    auto request = HttpRequestBuilder::post("https://example.test").param("q", "a b").json(Json::Object{{"ok", true}}).build(); assert(request.url == "https://example.test?q=a+b" && request.body == "{\"ok\":true}");
    PrototypeRegistry<> prototypes; auto circle = std::make_shared<Circle>(0, 0, "red", 2, std::vector<std::string>{"old"}); prototypes.registerPrototype("circle", circle); auto cloned = prototypes.create("circle"); cloned->tags.push_back("new"); assert(circle->tags.size() == 1);
    ObjectPool<int> pool([] { return std::make_shared<int>(0); }, [](int& value) { value = 0; }, 1); assert(pool.use([](int& value) { return value = 3; }) == 3); auto pooled = pool.acquire(); assert(*pooled == 0); pool.release(pooled);
    FahrenheitSensorAdapter sensor(LegacyFahrenheitSensor(212)); assert(sensor.celsius() == 100);
    auto adapted = promisify<int, int>(std::function<void(int, std::function<void(std::exception_ptr, int)>)>([](int x, auto callback) { callback(nullptr, x * 2); })); assert(adapted(4).get() == 8);
    Tv tv; AdvancedRemoteControl remote(tv); remote.togglePower(); remote.volumeUp(100); assert(tv.getVolume() == 100); remote.mute(); assert(tv.isEnabled() && tv.getVolume() == 0);
    Directory directory("root"); directory.add(std::make_shared<FileEntry>("a", 3), std::make_shared<FileEntry>("b", 4)); assert(directory.size() == 7 && directory.remove("a") && directory.size() == 4);
    SmsNotifier notifier(std::make_shared<EmailNotifier>("test@example.test"), "123"); assert(notifier.send("hello").size() == 2);
    std::vector<std::string> logs; auto logged = withLogging([](int x) { return x * 2; }, [&](auto line) { logs.push_back(line); }, "double"); assert(logged(3) == 6 && logs == std::vector<std::string>({"double(3)", "double -> 6"}));
    assert(VideoConverter().convert("x.mp4", "ogg") == "buffer(x.mp4, mp4-codec) -> ogg + normalized audio");
    Forest forest; forest.plant(1, 2, "oak", "green", "rough").plant(3, 4, "oak", "green", "rough"); assert(forest.typeCount() == 1 && forest.treeCount() == 2);
    struct Weather : WeatherService { int calls = 0; std::future<double> temperature(std::string) override { ++calls; return readyFuture(12.0); } } weather;
    double clock = 0; CachingWeatherProxy proxy(weather, 10, [&] { return clock; }); assert(proxy.temperature("x").get() == 12); proxy.temperature("x").get(); assert(weather.calls == 1); clock = 11; proxy.temperature("x").get(); assert(weather.calls == 2);
    AccessControlProxy denied(weather, [] { return false; }); bool rejected = false; try { denied.temperature("x").get(); } catch (const std::runtime_error&) { rejected = true; } assert(rejected);
    Json::Object object{{"n", 1}}; auto validated = createValidatedObject(object, [](auto, const Json& value) { return value.number() > 0; }); validated.set("n", 2); assert(object.at("n").number() == 2);
    auto chain = createSupportChain(); assert(chain->handle({"password", 1}) == "Bot: Use the \"Forgot password\" link"); assert(chain->handle({"bug", 3}) == "Engineer fixed bug");
    TextDocument document; CommandHistory history; history.run(std::make_shared<InsertCommand>(document, 0, "hello")); history.run(std::make_shared<DeleteCommand>(document, 1, 2)); assert(document.content == "hlo"); assert(history.undo() && document.content == "hello"); assert(history.redo() && document.content == "hlo");
    assert(parseExpression("2 + x * (3 + 1)")->interpret({{"x", 5}}) == 22); assert(parseExpression("2.5 + 0.5")->interpret() == 3);
    std::vector<double> range; for (auto value : take(NumberRange(0, 10), 3)) range.push_back(value); assert(range == Numbers({0, 1, 2}));
    std::vector<TreeItem<int>> roots{{1, {{2, {{4, {}}}}, {3, {}}}}}; std::vector<int> dfs, bfsValues; for (auto value : depthFirst(roots)) dfs.push_back(value); for (auto value : breadthFirst(roots)) bfsValues.push_back(value); assert(dfs == std::vector<int>({1, 2, 4, 3}) && bfsValues == std::vector<int>({1, 2, 3, 4}));
    ChatRoom room; ChatUser a("a"), b("b"); room.join(a); room.join(b); a.say("hello"); assert(b.inbox[0] == "a: hello");
    Editor editor; EditorHistory snapshots(editor); editor.type("abc"); snapshots.backup(); editor.type("d"); assert(snapshots.undo() && editor.text() == "abc");
    Subject<int> subject; int total = 0; auto observer = std::make_shared<Observer<int>>([&](int value) { total += value; }); auto unsubscribe = subject.subscribe(observer); subject.subscribe(observer); subject.notify(2); unsubscribe(); subject.notify(5); assert(total == 2);
    Order order; order.pay(); order.ship(); order.deliver(); assert(order.history == std::vector<std::string>({"new", "paid", "shipped", "delivered"}));
    ShippingCalculator shipping(std::make_shared<WeightBasedShipping>(3)); assert(shipping.calculate({2.5, 100}) == 9);
    auto report = JsonSalesMiner().mine("[{\"product\":\"a\",\"amount\":3},{\"product\":\"b\",\"amount\":4}]"); assert(report.total == 7 && report.topProduct == "b");
    AreaVisitor area; PerimeterVisitor perimeter; assert(RectangleShape(3, 4).accept(area) == 12 && TriangleShape(3, 4, 5).accept(perimeter) == 12); assert(Json::parse(CircleShape(2).accept(JsonExportVisitor())).at("radius").number() == 2);
    Container container; auto service = token<std::shared_ptr<int>>("service"); container.registerProvider(service, [](Container&) { return std::make_shared<int>(4); }); assert(container.resolve(service) == container.resolve(service));
    auto cyclic = token<int>("cycle"); container.registerProvider(cyclic, [&](Container& c) { return c.resolve(cyclic); }); rejected = false; try { container.resolve(cyclic); } catch (const std::logic_error&) { rejected = true; } assert(rejected);
    TypedEventEmitter<int> emitter; auto listener = std::make_shared<Observer<int>>([&](int value) { total += value; }); emitter.once("x", listener); assert(emitter.emit("x", 3) == 0 && emitter.emit("x", 3) == 0 && total == 5);
    Pipeline<std::vector<int>> pipeline; pipeline.use([](auto& context, Next next) { context.push_back(1); next().get(); context.push_back(4); return completedFuture(); }).use([](auto& context, Next next) { context.push_back(2); next().get(); context.push_back(3); return completedFuture(); }); std::vector<int> trace; pipeline.run(trace).get(); assert(trace == std::vector<int>({1, 2, 3, 4}));
    auto memory = std::make_shared<MemoryLogger>(); PaymentService payment(memory); assert(payment.charge(3) && !payment.charge(-1) && memory->lines.size() == 2);
    struct Entity { std::string id; std::vector<int> values; }; InMemoryRepository<Entity> repository; repository.save({"a", {1}}).get(); auto entity = repository.findById("a").get(); entity->values.push_back(2); assert(repository.findById("a").get()->values.size() == 1 && repository.deleteValue("a").get());
    auto positive = spec<int>([](const int& value) { return value > 0; }); assert(positive.andSpec(positive.notSpec()).isSatisfiedBy(2) == false);
    auto store = createStore<double, CounterAction>(counterReducer, 0); store.dispatch({"add", 5}); assert(store.getState() == 5);
    int attempts = 0; assert(retry<int>([&] { if (++attempts < 3) return failedFuture<int>(std::make_exception_ptr(std::runtime_error("again"))); return readyFuture(7); }).get() == 7 && attempts == 3);
    CircuitBreakerOptions options; options.failureThreshold = 1; options.resetTimeoutMs = 10; options.now = [&] { return clock; }; bool fail = true; CircuitBreaker<int, int> breaker([&](int value) { return fail ? failedFuture<int>(std::make_exception_ptr(std::runtime_error("offline"))) : readyFuture(value); }, options); try { breaker.call(1).get(); } catch (...) {} assert(breaker.state() == "open"); clock += 11; assert(breaker.state() == "half-open"); fail = false; assert(breaker.call(2).get() == 2 && breaker.state() == "closed");
    std::cout << "C++: pattern scenarios passed\n";
}
