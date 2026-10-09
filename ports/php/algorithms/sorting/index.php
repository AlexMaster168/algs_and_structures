<?php
declare(strict_types=1);

namespace Ports\Algorithms\Sorting;

foreach (['bubble-sort','bucket-sort','cocktail-shaker-sort','counting-sort','heap-sort','insertion-sort','merge-sort','quick-sort','radix-sort','selection-sort','shell-sort','tim-sort'] as $module) require_once __DIR__.'/'.$module.'.php';
