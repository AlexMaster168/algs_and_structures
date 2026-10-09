use serde_json::{json, Value};
fn same(a: &Value, b: &Value) -> bool {
    match (a, b) {
        (Value::Number(x), Value::Number(y)) => {
            let x = x.as_f64().unwrap();
            let y = y.as_f64().unwrap();
            (x - y).abs() <= 1e-9 * 1.0f64.max(x.abs()).max(y.abs())
        }
        (Value::Array(x), Value::Array(y)) => {
            x.len() == y.len() && x.iter().zip(y).all(|(a, b)| same(a, b))
        }
        (Value::Object(x), Value::Object(y)) => {
            x.len() == y.len()
                && x.iter()
                    .all(|(key, a)| y.get(key).is_some_and(|b| same(a, b)))
        }
        _ => a == b,
    }
}
#[test]
fn conformance() {
    let fixtures: Value = serde_json::from_str(include_str!("../../golden-cases.json")).unwrap();
    let check = |i: usize, actual: Value| {
        assert!(
            same(&actual, &fixtures[i]["expected"]),
            "{}: {} != {}",
            fixtures[i]["name"],
            actual,
            fixtures[i]["expected"]
        );
    };
    check(
        0,
        json!(
            algorithm_collection::algorithms::sorting::bubble_sort::bubble_sort(
                &[3.0, -1.0, 3.0, 0.0],
                f64::total_cmp
            )
        ),
    );
    check(
        1,
        json!(
            algorithm_collection::algorithms::sorting::cocktail_shaker_sort::cocktail_shaker_sort(
                &[3.0, -1.0, 3.0, 0.0],
                f64::total_cmp
            )
        ),
    );
    check(
        2,
        json!(
            algorithm_collection::algorithms::sorting::selection_sort::selection_sort(
                &[3.0, -1.0, 3.0, 0.0],
                f64::total_cmp
            )
        ),
    );
    check(
        3,
        json!(
            algorithm_collection::algorithms::sorting::insertion_sort::insertion_sort(
                &[3.0, -1.0, 3.0, 0.0],
                f64::total_cmp
            )
        ),
    );
    check(
        4,
        json!(
            algorithm_collection::algorithms::sorting::shell_sort::shell_sort(
                &[3.0, -1.0, 3.0, 0.0],
                f64::total_cmp
            )
        ),
    );
    check(
        5,
        json!(
            algorithm_collection::algorithms::sorting::merge_sort::merge_sort(
                &[3.0, -1.0, 3.0, 0.0],
                f64::total_cmp
            )
        ),
    );
    check(
        6,
        json!(
            algorithm_collection::algorithms::sorting::merge_sort::bottom_up_merge_sort(
                &[3.0, -1.0, 3.0, 0.0],
                f64::total_cmp
            )
        ),
    );
    check(
        7,
        json!(
            algorithm_collection::algorithms::sorting::quick_sort::quick_sort(
                &[3.0, -1.0, 3.0, 0.0],
                f64::total_cmp
            )
        ),
    );
    check(
        8,
        json!(
            algorithm_collection::algorithms::sorting::quick_sort::quick_sort_functional(
                &[3.0, -1.0, 3.0, 0.0],
                f64::total_cmp
            )
        ),
    );
    check(
        9,
        json!(
            algorithm_collection::algorithms::sorting::heap_sort::heap_sort(
                &[3.0, -1.0, 3.0, 0.0],
                f64::total_cmp
            )
        ),
    );
    check(
        10,
        json!(
            algorithm_collection::algorithms::sorting::counting_sort::counting_sort(&[3, -1, 3, 0])
        ),
    );
    check(
        11,
        json!(
            algorithm_collection::algorithms::sorting::radix_sort::radix_sort(&[3, -1, 3, 0], 10)
        ),
    );
    check(
        12,
        json!(
            algorithm_collection::algorithms::sorting::bucket_sort::bucket_sort(
                &[3.0, -1.0, 3.0, 0.0],
                10
            )
        ),
    );
    check(
        13,
        json!(
            algorithm_collection::algorithms::sorting::tim_sort::tim_sort(
                &[3.0, -1.0, 3.0, 0.0],
                f64::total_cmp
            )
        ),
    );
    check(
        14,
        json!(
            algorithm_collection::algorithms::searching::linear_search::linear_search(
                &[4, 1, 4],
                &4,
                i32::cmp
            )
        ),
    );
    check(
        15,
        json!(
            algorithm_collection::algorithms::searching::binary_search::binary_search(
                &[1, 3, 5, 7],
                &5,
                i32::cmp
            )
        ),
    );
    check(
        16,
        json!(
            algorithm_collection::algorithms::searching::jump_search::jump_search(
                &[1, 3, 5, 7],
                &5,
                i32::cmp
            )
        ),
    );
    check(
        17,
        json!(
            algorithm_collection::algorithms::searching::interpolation_search::interpolation_search(
                &[1, 3, 5, 7],
                5
            )
        ),
    );
    check(
        18,
        json!(
            algorithm_collection::algorithms::searching::exponential_search::exponential_search(
                &[1, 3, 5, 7],
                &5,
                i32::cmp
            )
        ),
    );
    check(
        19,
        json!(
            algorithm_collection::algorithms::searching::quick_select::quick_select(
                &[7.0, 10.0, 4.0, 3.0, 20.0, 15.0],
                2,
                f64::total_cmp
            )
        ),
    );
    check(
        20,
        json!(
            algorithm_collection::algorithms::searching::quick_select::median(&[
                1.0, 5.0, 3.0, 7.0
            ])
        ),
    );
    check(
        21,
        json!(
            algorithm_collection::algorithms::dynamic_programming::fibonacci::fibonacci_recursive(
                10
            )
        ),
    );
    check(
        22,
        json!(
            algorithm_collection::algorithms::dynamic_programming::fibonacci::fibonacci(100)
                .to_string()
        ),
    );
    check(
        23,
        json!(
            algorithm_collection::algorithms::dynamic_programming::fibonacci::fibonacci_fast(100)
                .to_string()
        ),
    );
    check(
        24,
        json!(
            algorithm_collection::algorithms::dynamic_programming::edit_distance::edit_distance(
                "kitten", "sitting"
            )
        ),
    );
    check(
        25,
        json!(
            algorithm_collection::algorithms::dynamic_programming::coin_change::coin_change_ways(
                &[1, 2, 5],
                5
            )
        ),
    );
    check(
        26,
        json!(
            algorithm_collection::algorithms::dynamic_programming::grid_paths::unique_paths(
                3,
                7,
                &[]
            )
        ),
    );
    check(
        27,
        json!(
            algorithm_collection::algorithms::dynamic_programming::grid_paths::min_path_sum(&[
                vec![1.0, 3.0, 1.0],
                vec![1.0, 5.0, 1.0],
                vec![4.0, 2.0, 1.0]
            ])
        ),
    );
    check(
        28,
        json!(
            algorithm_collection::algorithms::dynamic_programming::subset_sum::can_partition(&[
                1, 5, 11, 5
            ])
        ),
    );
    check(
        29,
        json!(algorithm_collection::algorithms::strings::kmp::prefix_function("ababaca")),
    );
    check(
        30,
        json!(algorithm_collection::algorithms::strings::kmp::kmp_search(
            "aaaaa", "aa"
        )),
    );
    check(
        31,
        json!(algorithm_collection::algorithms::strings::z_function::z_function("aaaaa")),
    );
    check(
        32,
        json!(algorithm_collection::algorithms::strings::rabin_karp::rabin_karp("aaaaa", "aa")),
    );
    check(
        33,
        json!(
            algorithm_collection::algorithms::strings::boyer_moore_horspool::boyer_moore_horspool(
                "aaaaa", "aa"
            )
        ),
    );
    check(
        34,
        json!(
            algorithm_collection::algorithms::strings::manacher::longest_palindromic_substring(
                "forgeeksskeegfor"
            )
        ),
    );
    check(
        35,
        json!(algorithm_collection::algorithms::strings::suffix_array::suffix_array("banana")),
    );
    check(
        36,
        json!(algorithm_collection::algorithms::math::gcd::gcd(-48, 18)),
    );
    check(
        37,
        json!(algorithm_collection::algorithms::math::gcd::lcm(21, 6)),
    );
    {
        let result = algorithm_collection::algorithms::math::gcd::extended_gcd(240, 46);
        check(38, json!({"gcd":result.gcd,"x":result.x,"y":result.y}));
    }
    check(
        39,
        json!(algorithm_collection::algorithms::math::gcd::mod_inverse(
            3, 11
        )),
    );
    check(
        40,
        json!(algorithm_collection::algorithms::math::power::fast_power(
            2.0, 10
        )),
    );
    check(
        41,
        json!(algorithm_collection::algorithms::math::power::integer_sqrt(
            80
        )),
    );
    check(
        42,
        json!(algorithm_collection::algorithms::math::primes::sieve_of_eratosthenes(30)),
    );
    {
        let (primes, factors) = algorithm_collection::algorithms::math::primes::linear_sieve(10);
        check(43, json!({"primes":primes,"smallestFactor":factors}));
    }
    check(
        44,
        json!(algorithm_collection::algorithms::math::primes::is_prime(97)),
    );
    {
        let entries: Vec<_> = algorithm_collection::algorithms::math::primes::prime_factors(360)
            .into_iter()
            .collect();
        check(45, json!(entries));
    }
    check(
        46,
        json!(algorithm_collection::algorithms::math::primes::divisors(36)),
    );
    check(
        47,
        json!(algorithm_collection::algorithms::math::primes::euler_phi(
            36
        )),
    );
    check(
        48,
        json!(algorithm_collection::algorithms::math::combinatorics::factorial(30).to_string()),
    );
    check(
        49,
        json!(algorithm_collection::algorithms::math::combinatorics::binomial(50, 25).to_string()),
    );
    check(
        50,
        json!(algorithm_collection::algorithms::math::combinatorics::catalan(20).to_string()),
    );
    check(
        51,
        json!(algorithm_collection::algorithms::math::number_conversion::to_roman(2026)),
    );
    check(
        52,
        json!(algorithm_collection::algorithms::math::number_conversion::from_roman("MMXXVI")),
    );
    check(
        53,
        json!(algorithm_collection::algorithms::math::matrix::multiply(
            &[vec![1.0, 2.0], vec![3.0, 4.0]],
            &[vec![5.0, 6.0], vec![7.0, 8.0]]
        )),
    );
    check(
        54,
        json!(algorithm_collection::algorithms::math::matrix::determinant(
            &[vec![1.0, 2.0], vec![3.0, 4.0]]
        )),
    );
    check(
        55,
        json!(algorithm_collection::algorithms::backtracking::n_queens::count_n_queens(4)),
    );
    check(
        56,
        json!(
            algorithm_collection::algorithms::backtracking::word_search::word_search(
                &["ABCE".to_owned(), "SFCS".to_owned(), "ADEE".to_owned()],
                "ABCCED"
            )
        ),
    );
    check(
        57,
        json!(algorithm_collection::algorithms::greedy::jump_game::can_reach_end(&[3, 2, 1, 0, 4])),
    );
    check(
        58,
        json!(algorithm_collection::algorithms::greedy::jump_game::min_jumps(&[2, 3, 1, 1, 4])),
    );
    check(
        59,
        json!(algorithm_collection::algorithms::bit_manipulation::bits::reverse_bits(1)),
    );
    check(
        60,
        json!(algorithm_collection::algorithms::bit_manipulation::bits::count_set_bits(4294967295)),
    );
    check(
        61,
        json!(
            algorithm_collection::algorithms::graphs::topological_sort::topological_sort_kahn(
                &vec![vec![1, 2], vec![3], vec![3], vec![]]
            )
        ),
    );
    check(
        62,
        json!(
            algorithm_collection::algorithms::graphs::bipartite::is_bipartite(&vec![
                vec![1, 2],
                vec![0, 2],
                vec![0, 1]
            ])
        ),
    );
    check(
        63,
        json!(
            algorithm_collection::algorithms::graphs::max_flow::edmonds_karp(
                &[
                    vec![0.0, 3.0, 2.0, 0.0],
                    vec![0.0, 0.0, 1.0, 2.0],
                    vec![0.0, 0.0, 0.0, 3.0],
                    vec![0.0, 0.0, 0.0, 0.0]
                ],
                0,
                3
            )
        ),
    );
}
