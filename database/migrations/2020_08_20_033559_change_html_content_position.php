<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

class ChangeHtmlContentPosition extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        // DB::statement('alter table blog')
        Schema::table('blog', function (Blueprint $table) {
            $table->dropColumn('html_content');
            $table->dropColumn('md_content');
        });
        Schema::table('blog', function (Blueprint $table) {
            $table->text('html_content')->after('id')->collation('utf8mb4_general_ci');
            $table->text('md_content')->after('id')->collation('utf8mb4_general_ci');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('blog', function (Blueprint $table) {
        });
    }
}
